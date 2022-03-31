# Code is modified from version provided at https://web3py.readthedocs.io/en/latest/examples.html#example-code

"""A stateful event scanner for Ethereum-based blockchains using Web3.py.

With the stateful mechanism, you can do one batch scan or incremental scans,
where events are added wherever the scanner left off.
"""

import os
import sched
from eth_typing import BlockNumber
from web3.providers.rpc import HTTPProvider
import json
import datetime
import time
import logging
from abc import ABC, abstractmethod
from typing import Tuple, Optional, Callable, List, Iterable
from sqlitedict import SqliteDict

from web3 import Web3
from web3.contract import Contract
from web3.datastructures import AttributeDict
from web3.exceptions import BlockNotFound
from eth_abi.codec import ABICodec

# Currently this method is not exposed over official web3 API,
# but we need it to construct eth_getLogs parameters
from web3._utils.filters import construct_event_filter_params
from web3._utils.events import get_event_data
from dotenv import load_dotenv, find_dotenv

from discord_webhook import DiscordWebhook

load_dotenv(find_dotenv())

logger = logging.getLogger(__name__)
FIRST_BLOCK_TO_SCAN = 21800000
RUN_EVERY_X_SECONDS = 4

IS_DEV = "PRODUCTION" not in os.environ or os.environ["PRODUCTION"] != "true"

SCRIPT_DIR = os.path.dirname(__file__)  # <-- absolute dir the script is in
DEPLOYMENT_REL_PATH = (
    "../../../ui/deployment.json" if IS_DEV else "../../../ui/deployment-prod.json"
)
PAWN_SHOP_REL_PATH = (
    "../../../build/contracts/PawnShop.json"
    if IS_DEV
    else "../../../prod-deployment/contracts/PawnShop.json"
)

DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL")

ADDRESSES = json.load(open(os.path.join(SCRIPT_DIR, DEPLOYMENT_REL_PATH)))

CONTRACT_ADDRESS = ADDRESSES["PawnShop"]
CONTRACT_FILE = json.load(
    open(os.path.join(SCRIPT_DIR, PAWN_SHOP_REL_PATH), "r"))
CONTRACT_ABI = CONTRACT_FILE["abi"]
FIRST_BLOCK_TO_SCAN = ADDRESSES["deploymentBlock"]

DB_FOLDER_PREFIX = os.path.join(SCRIPT_DIR, "../../db/jewel")


class IEventScannerState(ABC):
    """Application state that remembers what blocks we have scanned in the case of crash."""

    @abstractmethod
    def get_last_scanned_block(self) -> int:
        """Number of the last block we have scanned on the previous cycle.

        :return: 0 if no blocks scanned yet
        """

    @abstractmethod
    def start_chunk(self, block_number: int):
        """Scanner is about to ask data of multiple blocks over JSON-RPC.

        Start a database session if needed.
        """

    @abstractmethod
    def end_chunk(self, block_number: int):
        """Scanner finished a number of blocks.

        Persistent any data in your state now.
        """

    @abstractmethod
    def process_event(
        self, block_when: datetime.datetime, event: AttributeDict, latest_block_number: BlockNumber
    ) -> object:
        """Process incoming events.

        This function takes raw events from Web3, transforms them to your application internal
        format, then saves them in a database or some other state.

        :param block_when: When this block was mined

        :param event: Symbolic dictionary of the event data

        :return: Internal state structure that is the result of event tranformation.
        """

    @abstractmethod
    def delete_data(self, since_block: int) -> int:
        """Delete any data since this block was scanned.

        Purges any potential minor reorg data.
        """


class EventScanner:
    """Scan blockchain for events and try not to abuse JSON-RPC API too much.

    Can be used for real-time scans, as it detects minor chain reorganisation and rescans.
    Unlike the easy web3.contract.Contract, this scanner can scan events from multiple contracts at once.
    For example, you can get all transfers from all tokens in the same scan.

    You *should* disable the default `http_retry_request_middleware` on your provider for Web3,
    because it cannot correctly throttle and decrease the `eth_getLogs` block number range.
    """

    def __init__(
        self,
        web3: Web3,
        contract: Contract,
        state: IEventScannerState,
        events: List,
        filters: {},
        max_chunk_scan_size: int = 10000,
        max_request_retries: int = 30,
        request_retry_seconds: float = 3.0,
    ):
        """
        :param contract: Contract
        :param events: List of web3 Event we scan
        :param filters: Filters passed to getLogs
        :param max_chunk_scan_size: JSON-RPC API limit in the number of blocks we query. (Recommendation: 10,000 for mainnet, 500,000 for testnets)
        :param max_request_retries: How many times we try to reattempt a failed JSON-RPC call
        :param request_retry_seconds: Delay between failed requests to let JSON-RPC server to recover
        """

        self.logger = logger
        self.contract = contract
        self.web3 = web3
        self.state = state
        self.events = events
        self.filters = filters

        # Our JSON-RPC throttling parameters
        self.min_scan_chunk_size = 10  # 12 s/block = 120 seconds period
        self.max_scan_chunk_size = max_chunk_scan_size
        self.max_request_retries = max_request_retries
        self.request_retry_seconds = request_retry_seconds

        # Factor how fast we increase the chunk size if results are found
        # # (slow down scan after starting to get hits)
        self.chunk_size_decrease = 0.5

        # Factor how was we increase chunk size if no results found
        self.chunk_size_increase = 2.0

    @property
    def address(self):
        return self.token_address

    def get_block_timestamp(self, block_num) -> datetime.datetime:
        """Get Ethereum block timestamp"""
        try:
            block_info = self.web3.eth.getBlock(block_num)
        except BlockNotFound:
            # Block was not mined yet,
            # minor chain reorganisation?
            return None
        last_time = block_info["timestamp"]
        return datetime.datetime.fromtimestamp(last_time, datetime.timezone.utc)

    def get_suggested_scan_start_block(self):
        """Get where we should start to scan for new token events.

        If there are no prior scans, start from block 1.
        Otherwise, start from the last end block minus ten blocks.
        We rescan the last ten scanned blocks in the case there were forks to avoid
        misaccounting due to minor single block works (happens once in a hour in Ethereum).
        These heurestics could be made more robust, but this is for the sake of simple reference implementation.
        """

        end_block = self.get_last_scanned_block()
        if end_block:
            return max(1, end_block - self.NUM_BLOCKS_RESCAN_FOR_FORKS)
        return 1

    def get_suggested_scan_end_block(self):
        """Get the last mined block on Ethereum chain we are following."""

        # Do not scan all the way to the final block, as this
        # block might not be mined yet
        return self.web3.eth.blockNumber

    def get_last_scanned_block(self) -> int:
        return self.state.get_last_scanned_block()

    def delete_potentially_forked_block_data(self, after_block: int):
        """Purge old data in the case of blockchain reorganisation."""
        self.state.delete_data(after_block)

    def scan_chunk(self, start_block, end_block) -> Tuple[int, datetime.datetime, list]:
        """Read and process events between to block numbers.

        Dynamically decrease the size of the chunk if the case JSON-RPC server pukes out.

        :return: tuple(actual end block number, when this block was mined, processed events)
        """

        block_timestamps = {}
        get_block_timestamp = self.get_block_timestamp

        # Cache block timestamps to reduce some RPC overhead
        # Real solution might include smarter models around block
        def get_block_when(block_num):
            if block_num not in block_timestamps:
                block_timestamps[block_num] = get_block_timestamp(block_num)
            return block_timestamps[block_num]

        all_processed = []

        for event_type in self.events:
            # Callable that takes care of the underlying web3 call
            def _fetch_events(_start_block, _end_block):
                return _fetch_events_for_all_contracts(
                    self.web3,
                    event_type,
                    self.filters,
                    from_block=_start_block,
                    to_block=_end_block,
                )

            # Do `n` retries on `eth_getLogs`,
            # throttle down block range if needed
            end_block, events = _retry_web3_call(
                _fetch_events,
                start_block=start_block,
                end_block=end_block,
                retries=self.max_request_retries,
                delay=self.request_retry_seconds,
            )

            for evt in events:
                idx = evt[
                    "logIndex"
                ]  # Integer of the log index position in the block, null when its pending

                # We cannot avoid minor chain reorganisations, but
                # at least we must avoid blocks that are not mined yet
                assert idx is not None, "Somehow tried to scan a pending block"

                block_number = evt["blockNumber"]

                tx = {}
                if evt["event"] == "UTXORedeemed":
                    tx = self.web3.eth.get_transaction(evt["transactionHash"])

                # Get UTC time when this event happened (block mined timestamp)
                # from our in-memory cache
                block_when = get_block_when(block_number)

                logger.debug(
                    "Processing event %s, block: %d",
                    evt["event"],
                    evt["blockNumber"],
                )
                processed = self.state.process_event(
                    block_when, evt, tx=tx, latest_block_number=self.web3.eth.blockNumber)
                all_processed.append(processed)

        end_block_timestamp = get_block_when(end_block)
        return end_block, end_block_timestamp, all_processed

    def estimate_next_chunk_size(self, current_chuck_size: int, event_found_count: int):
        """Try to figure out optimal chunk size

        Our scanner might need to scan the whole blockchain for all events

        * We want to minimize API calls over empty blocks

        * We want to make sure that one scan chunk does not try to process too many entries once, as we try to control commit buffer size and potentially asynchronous busy loop

        * Do not overload node serving JSON-RPC API by asking data for too many events at a time

        Currently Ethereum JSON-API does not have an API to tell when a first event occured in a blockchain
        and our heuristics try to accelerate block fetching (chunk size) until we see the first event.

        These heurestics exponentially increase the scan chunk size depending on if we are seeing events or not.
        When any transfers are encountered, we are back to scanning only a few blocks at a time.
        It does not make sense to do a full chain scan starting from block 1, doing one JSON-RPC call per 20 blocks.
        """

        if event_found_count > 0:
            # When we encounter first events, reset the chunk size window
            current_chuck_size = self.min_scan_chunk_size
        else:
            current_chuck_size *= self.chunk_size_increase

        current_chuck_size = max(self.min_scan_chunk_size, current_chuck_size)
        current_chuck_size = min(self.max_scan_chunk_size, current_chuck_size)
        return int(current_chuck_size)

    def scan(
        self,
        start_block,
        end_block,
        start_chunk_size=20,
        progress_callback=Optional[Callable],
    ) -> Tuple[list, int]:
        """Perform a token balances scan.

        Assumes all balances in the database are valid before start_block (no forks sneaked in).

        :param start_block: The first block included in the scan

        :param end_block: The last block included in the scan

        :param start_chunk_size: How many blocks we try to fetch over JSON-RPC on the first attempt

        :param progress_callback: If this is an UI application, update the progress of the scan

        :return: [All processed events, number of chunks used]
        """

        assert start_block <= end_block

        current_block = start_block

        # Scan in chunks, commit between
        chunk_size = start_chunk_size
        last_scan_duration = last_logs_found = 0
        total_chunks_scanned = 0

        # All processed entries we got on this scan cycle
        all_processed = []

        while current_block <= end_block:

            self.state.start_chunk(current_block, chunk_size)

            # Print some diagnostics to logs to try to fiddle with real world JSON-RPC API performance
            estimated_end_block = current_block + chunk_size
            logger.debug(
                "Scanning token transfers for blocks: %d - %d, chunk size %d, last chunk scan took %f, last logs found %d",
                current_block,
                estimated_end_block,
                chunk_size,
                last_scan_duration,
                last_logs_found,
            )

            start = time.time()
            actual_end_block, end_block_timestamp, new_entries = self.scan_chunk(
                current_block, estimated_end_block
            )

            # Where does our current chunk scan ends - are we out of chain yet?
            current_end = actual_end_block

            last_scan_duration = time.time() - start
            all_processed += new_entries

            if progress_callback:
                progress_callback(
                    start_block,
                    end_block,
                    current_block,
                    end_block_timestamp,
                    chunk_size,
                    len(new_entries),
                )

            # Try to guess how many blocks to fetch over `eth_getLogs` API next time
            chunk_size = self.estimate_next_chunk_size(
                chunk_size, len(new_entries))

            # Set where the next chunk starts
            current_block = current_end + 1
            total_chunks_scanned += 1
            self.state.end_chunk(min(current_end, end_block))

        return all_processed, total_chunks_scanned


def _retry_web3_call(func, start_block, end_block, retries, delay) -> Tuple[int, list]:
    """A custom retry loop to throttle down block range.

    If our JSON-RPC server cannot serve all incoming `eth_getLogs` in a single request,
    we retry and throttle down block range for every retry.

    For example, Go Ethereum does not indicate what is an acceptable response size.
    It just fails on the server-side with a "context was cancelled" warning.

    :param func: A callable that triggers Ethereum JSON-RPC, as func(start_block, end_block)
    :param start_block: The initial start block of the block range
    :param end_block: The initial start block of the block range
    :param retries: How many times we retry
    :param delay: Time to sleep between retries
    """
    for i in range(retries):
        try:
            return end_block, func(start_block, end_block)
        except Exception as e:
            # Assume this is HTTPConnectionPool(host="localhost", port=8545): Read timed out. (read timeout=10)
            # from Go Ethereum. This translates to the error "context was cancelled" on the server side:
            # https://github.com/ethereum/go-ethereum/issues/20426
            if i < retries - 1:
                # Give some more verbose info than the default middleware
                logger.warning(
                    "Retrying events for block range %d - %d (%d) failed with %s, retrying in %s seconds",
                    start_block,
                    end_block,
                    end_block - start_block,
                    e,
                    delay,
                )
                # Decrease the `eth_getBlocks` range
                end_block = start_block + ((end_block - start_block) // 2)
                # Let the JSON-RPC to recover e.g. from restart
                time.sleep(delay)
                continue
            else:
                logger.warning("Out of retries")
                raise


def _fetch_events_for_all_contracts(
    web3, event, argument_filters: dict, from_block: int, to_block: int
) -> Iterable:
    """Get events using eth_getLogs API.

    This method is detached from any contract instance.

    This is a stateless method, as opposed to createFilter.
    It can be safely called against nodes which do not provide `eth_newFilter` API, like Infura.
    """

    if from_block is None:
        raise TypeError(
            "Missing mandatory keyword argument to getLogs: fromBlock")

    # Currently no way to poke this using a public Web3.py API.
    # This will return raw underlying ABI JSON object for the event
    abi = event._get_event_abi()

    # Depending on the Solidity version used to compile
    # the contract that uses the ABI,
    # it might have Solidity ABI encoding v1 or v2.
    # We just assume the default that you set on Web3 object here.
    # More information here https://eth-abi.readthedocs.io/en/latest/index.html
    codec: ABICodec = web3.codec

    # Here we need to poke a bit into Web3 internals, as this
    # functionality is not exposed by default.
    # Construct JSON-RPC raw filter presentation based on human readable Python descriptions
    # Namely, convert event names to their keccak signatures
    # More information here:
    # https://github.com/ethereum/web3.py/blob/e176ce0793dafdd0573acc8d4b76425b6eb604ca/web3/_utils/filters.py#L71
    data_filter_set, event_filter_params = construct_event_filter_params(
        abi,
        codec,
        address=argument_filters.get("address"),
        argument_filters=argument_filters,
        fromBlock=from_block,
        toBlock=to_block,
    )

    logger.debug(
        "Querying eth_getLogs with the following parameters: %s", event_filter_params
    )

    # Call JSON-RPC API on your Ethereum node.
    # get_logs() returns raw AttributedDict entries
    logs = web3.eth.get_logs(event_filter_params)

    # Convert raw binary data to Python proxy objects as described by ABI
    all_events = []
    for log in logs:
        # Convert raw JSON-RPC log result to human readable event by using ABI data
        # More information how processLog works here
        # https://github.com/ethereum/web3.py/blob/fbaf1ad11b0c7fac09ba34baff2c256cffe0a148/web3/_utils/events.py#L200
        evt = get_event_data(codec, abi, log)
        # Note: This was originally yield,
        # but deferring the timeout exception caused the throttle logic not to work
        all_events.append(evt)
    return all_events


class SqliteDictState(IEventScannerState):
    """Store the state of scanned blocks and all events.

    All state is a dict backed by sqlite, by using sqlitedict.
    """

    def __init__(self):
        pass

    def reset(self):
        """Create initial state of nothing scanned."""
        self.state_meta.clear()
        self.state_utxo.clear()
        self.state_utxos_by_user.clear()
        self.state_utxo_redemptions.clear()
        self.state_meta["last_scanned_block"] = FIRST_BLOCK_TO_SCAN
        self.state_meta["last_utxo_redemption_index"] = 0
        self.commit()

    def restore(self):
        self.state_meta = SqliteDict(
            filename=os.path.join(DB_FOLDER_PREFIX, "./state_meta.sqlite"),
            autocommit=False,
            flag="c",
            journal_mode="WAL",
        )
        self.state_utxo = SqliteDict(
            filename=os.path.join(DB_FOLDER_PREFIX, "./state_utxo.sqlite"),
            autocommit=False,
            flag="c",
            journal_mode="WAL",
        )
        self.state_utxo_seen_events = SqliteDict(
            filename=os.path.join(
                DB_FOLDER_PREFIX, "./state_utxo_seen_events.sqlite"),
            autocommit=False,
            flag="c",
            journal_mode="WAL",
        )
        self.state_utxos_by_user = SqliteDict(
            filename=os.path.join(
                DB_FOLDER_PREFIX, "./state_utxos_by_user.sqlite"),
            autocommit=False,
            flag="c",
            journal_mode="WAL",
        )
        self.state_utxo_redemptions = SqliteDict(
            filename=os.path.join(
                DB_FOLDER_PREFIX, "./state_utxo_redemptions.sqlite"),
            autocommit=False,
            flag="c",
            journal_mode="WAL",
        )
        self.state_aggregates = SqliteDict(
            filename=os.path.join(
                DB_FOLDER_PREFIX, "./state_aggregates.sqlite"),
            autocommit=False,
            flag="c",
            journal_mode="WAL",
        )

    def save(self):
        logger.debug("...CLOSING STATE...")
        self.state_meta.close()
        self.state_utxo.close()
        self.state_utxo_seen_events.close()
        self.state_utxos_by_user.close()
        self.state_utxo_redemptions.close()
        self.state_aggregates.close()
        logger.debug("...STATE CLOSED...")

    def commit(self):
        logger.debug("...COMITTING STATE...")
        self.state_meta.commit(blocking=True)
        self.state_utxo.commit(blocking=True)
        self.state_utxo_seen_events.commit(blocking=True)
        self.state_utxos_by_user.commit(blocking=True)
        self.state_utxo_redemptions.commit(blocking=True)
        self.state_aggregates.commit(blocking=True)
        logger.debug("...STATE COMMITED...")

    #
    # EventScannerState methods implemented below
    #

    def get_last_scanned_block(self):
        """The number of the last block we have stored."""
        return (
            self.state_meta["last_scanned_block"]
            if "last_scanned_block" in self.state_meta
            else FIRST_BLOCK_TO_SCAN
        )

    def delete_data(self, since_block):
        """Remove potentially reorganised blocks from the scan data."""
        pass

    def start_chunk(self, block_number, chunk_size):
        """Save at the end of each chunk, so we can resume in the case of a crash or CTRL+C"""
        self.commit()

    def end_chunk(self, block_number):
        """Save at the end of each chunk, so we can resume in the case of a crash or CTRL+C"""
        # Next time the scanner is started we will resume from this block
        self.state_meta["last_scanned_block"] = block_number
        self.commit()

    def process_event(
        self, block_when: datetime.datetime, event: AttributeDict, tx: AttributeDict, latest_block_number: BlockNumber
    ) -> str:
        """Record a ERC-20 transfer in our database."""
        # Events are keyed by their transaction hash and log index
        # One transaction may contain multiple events
        # and each one of those gets their own log index

        # event_name = event.event # "Transfer"
        log_index = event.logIndex  # Log index within the block
        # transaction_index = event.transactionIndex  # Transaction index within the block
        txhash = event.transactionHash.hex()  # Transaction hash
        block_number = event.blockNumber
        event_type = event["event"]

        utxoObject = None

        # Convert ERC-20 Transfer event to our internal format
        args = event["args"]

        def is_event_seen(db):
            key = f"{block_number}-{txhash}-{log_index}-{event_type}"
            return key in db and db[key] is True

        def mark_event_as_seen(db):
            key = f"{block_number}-{txhash}-{log_index}-{event_type}"
            db[key] = True

        # TODO: refactor all this so it"s not just one big function
        if event_type == "UTXOCreated":
            if not is_event_seen(self.state_utxo_seen_events):
                utxoObject = {
                    "utxoAddress": args["utxoAddress"].lower(),
                    "minter": args["minter"].lower(),
                }

                if (
                    utxoObject["minter"] in self.state_utxos_by_user
                    and self.state_utxos_by_user[utxoObject["minter"]] is not None
                ):
                    list_for_minter = self.state_utxos_by_user[utxoObject["minter"]]
                    if (
                        utxoObject["utxoAddress"]
                        not in self.state_utxos_by_user[utxoObject["minter"]]
                    ):
                        list_for_minter.append(utxoObject["utxoAddress"])
                    self.state_utxos_by_user[utxoObject["minter"]
                                             ] = list_for_minter
                else:
                    self.state_utxos_by_user[utxoObject["minter"]] = [
                        utxoObject["utxoAddress"]
                    ]
                mark_event_as_seen(self.state_utxo_seen_events)
            else:
                logger.warn(
                    f"Already seen UTXOCreated event {block_number}-{txhash}-{log_index}"
                )
        elif event_type == "UTXOValue":
            if not is_event_seen(self.state_utxo_seen_events):
                utxoObject = {
                    "utxoAddress": args["UTXOAddress"].lower(),
                    "newVal": str(args["newVal"]),
                    "blockNumber": block_number,
                    "timestamp": block_when.timestamp() * 1000,  # milliseconds
                }
                if int(args["newVal"]) > 0 and block_number > (latest_block_number - 100):
                    notify_new_stash(args["newVal"])
                mark_event_as_seen(self.state_utxo_seen_events)
            else:
                logger.warn(
                    f"Already seen UTXOValue event {block_number}-{txhash}-{log_index}"
                )
        elif event_type == "UTXORedeemed":
            if not is_event_seen(self.state_utxo_redemptions):
                last_utxo_redemption_index = (
                    self.state_meta["last_utxo_redemption_index"]
                    if "last_utxo_redemption_index" in self.state_meta
                    else "0"
                ) or "0"
                next_utxo_redemption_index = int(
                    last_utxo_redemption_index) + 1
                _redeem = args["redeemooor"].lower()
                if args["redeemooor"].lower() == ADDRESSES["PawnShopRouter"].lower():
                    _redeem = tx["from"].lower()
                self.state_utxo_redemptions[next_utxo_redemption_index] = {
                    "tx": txhash,
                    "utxoAddress": args["UTXOAddress"].lower(),
                    "redeemedBy": str(_redeem),
                    "amount": str(args["redeemedAmount"]),
                    "fee": str(args["feePaid"]),
                    "amountInJewel": str(args["feeRatio"]),
                    "totalCost": str(args["totalCost"]),
                    "blockNumber": block_number,
                    "timestamp": block_when.timestamp() * 1000,  # milliseconds
                }
                if block_number > (latest_block_number - 100):
                    notify_redeemed_stash(int(args["redeemedAmount"]))
                mark_event_as_seen(self.state_utxo_redemptions)
                self.state_meta[
                    "last_utxo_redemption_index"
                ] = next_utxo_redemption_index
            else:
                logger.warn(
                    f"Already seen UTXORedeemed event {block_number}-{txhash}-{log_index}"
                )

        if utxoObject is None:
            # no update made to object
            pass
        elif (
            utxoObject["utxoAddress"] in self.state_utxo
            and self.state_utxo[utxoObject["utxoAddress"]] is not None
        ):
            current_object = self.state_utxo[utxoObject["utxoAddress"]]
            current_object.update(utxoObject)
            self.state_utxo[utxoObject["utxoAddress"]] = current_object
        else:
            self.state_utxo[utxoObject["utxoAddress"]] = utxoObject

        # AGGREGATES
        if not is_event_seen(self.state_aggregates):
            # large numbers are always stored as string because JSON cannot handle massive uint256
            def get_agg(key):
                return int(
                    (
                        self.state_aggregates[key]
                        if key in self.state_aggregates
                        else "0"
                    )
                    or "0"
                )

            def get_agg_in_cur_bucket(key):
                bucket_key = block_when.replace(
                    minute=0, second=0, microsecond=0
                ).isoformat(timespec="seconds")
                key_ = f"{key}-{bucket_key}"
                return int(
                    (
                        self.state_aggregates[key_]
                        if key_ in self.state_aggregates
                        else "0"
                    )
                    or "0"
                )

            def update_agg(key, value, bucketValue=None):
                self.state_aggregates[key] = str(value)
                bucket_time = block_when.replace(
                    minute=0, second=0, microsecond=0
                ).isoformat(timespec="seconds")
                self.state_aggregates[f"{key}-{bucket_time}"] = str(
                    bucketValue if bucketValue is not None else value
                )

            current_total_stashes = get_agg("totalStashes")
            current_locked_jewel_in_protocol = get_agg("lockedJewelTotal")
            current_total_fees_paid = get_agg("totalFeesPaid")
            current_total_fees_paid_in_jewel = get_agg("totalFeesPaidInJewel")
            current_total_redemptions_volume = get_agg(
                "totalRedemptionsVolume")

            if event_type == "UTXOCreated":
                update_agg("totalStashes", current_total_stashes + 1)
            elif event_type == "MintedFromUTXO":
                update_agg(
                    "lockedJewelTotal",
                    current_locked_jewel_in_protocol +
                    int(args["mintedAmount"]),
                )
            elif event_type == "UTXORedeemed":
                update_agg(
                    "lockedJewelTotal",
                    current_locked_jewel_in_protocol -
                    int(args["redeemedAmount"]),
                )
                update_agg(
                    "totalFeesPaid", current_total_fees_paid +
                    int(args["feePaid"])
                )
                update_agg(
                    "totalFeesPaidInJewel",
                    current_total_fees_paid_in_jewel + int(args["feeRatio"]),
                )
                update_agg(
                    "totalRedemptionsVolume",
                    current_total_redemptions_volume +
                    int(args["redeemedAmount"]),
                )

            mark_event_as_seen(self.state_aggregates)

        self.commit()

        # Return a pointer that allows us to look up this event later if needed
        return f"{block_number}-{txhash}-{log_index}"


scheduler = sched.scheduler(time.time, time.sleep)


def run(sc):
    api_url = (
        os.environ["HARMONY_RPC_URL"]
        if "HARMONY_RPC_URL" in os.environ
        else "http://127.0.0.1:8545"
    )

    # Enable logs to the stdout.
    # DEBUG is very verbose level
    logging.basicConfig(level=logging.INFO)

    provider = HTTPProvider(api_url)

    # Remove the default JSON-RPC retry middleware
    # as it correctly cannot handle eth_getLogs block range
    # throttle down.
    provider.middlewares.clear()

    web3 = Web3(provider)

    # Prepare stub ERC-20 contract object
    abi = CONTRACT_ABI
    CONTRACT = web3.eth.contract(abi=abi)

    # Restore/create our persistent state
    state = SqliteDictState()
    state.restore()

    # chain_id: int, web3: Web3, abi: dict, state: EventScannerState, events: List, filters: {}, max_chunk_scan_size: int=10000
    scanner = EventScanner(
        web3=web3,
        contract=CONTRACT,
        state=state,
        events=[
            CONTRACT.events.UTXOValue,
            CONTRACT.events.UTXOCreated,
            CONTRACT.events.UTXORedeemed,
            CONTRACT.events.MintedFromUTXO,
        ],
        filters={"address": CONTRACT_ADDRESS},
        # How many maximum blocks at the time we request from JSON-RPC
        # and we are unlikely to exceed the response size limit of the JSON-RPC server
        max_chunk_scan_size=1000,
    )

    # Assume we might have scanned the blocks all the way to the last Ethereum block
    # that mined a few seconds before the previous scan run ended.
    # Because there might have been a minor Etherueum chain reorganisations
    # since the last scan ended, we need to discard
    # the last few blocks from the previous scan results.
    chain_reorg_safety_blocks = 20
    scanner.delete_potentially_forked_block_data(
        state.get_last_scanned_block() - chain_reorg_safety_blocks
    )

    # Scan from [last block scanned] - [latest ethereum block]
    # Note that our chain reorg safety blocks cannot go negative
    start_block = max(state.get_last_scanned_block() -
                      chain_reorg_safety_blocks, 0)
    end_block = scanner.get_suggested_scan_end_block()
    blocks_to_scan = end_block - start_block

    logger.info(f"Scanning events from blocks {start_block} - {end_block}")

    # Render a progress bar in the console
    start = time.time()

    def _update_progress(
        start, end, current, current_block_timestamp, chunk_size, events_count
    ):
        if current_block_timestamp:
            formatted_time = current_block_timestamp.strftime("%d-%m-%Y")
        else:
            formatted_time = "no block time available"
        logger.info(
            f"Current block: {current} ({formatted_time}), blocks in a scan batch: {chunk_size}, events processed in a batch {events_count}"
        )

    # Run the scan
    result, total_chunks_scanned = scanner.scan(
        start_block, end_block, progress_callback=_update_progress
    )

    state.save()
    duration = time.time() - start
    logger.info(
        f"Scanned total {len(result)} events, in {duration} seconds, total {total_chunks_scanned} chunk scans performed"
    )
    scheduler.enter(RUN_EVERY_X_SECONDS, 1, run, (sc,))


scheduler.enter(RUN_EVERY_X_SECONDS, 1, run, (scheduler,))


def notify_new_stash(value):
    webhook = DiscordWebhook(
        url=DISCORD_WEBHOOK_URL,
        content=f"New JEWEL stash has been minted! {value/1e18:.3f} locked JEWEL can be claimed.",
    )
    response = webhook.execute()


def notify_redeemed_stash(redeemed_value):
    webhook = DiscordWebhook(
        url=DISCORD_WEBHOOK_URL,
        content=f"A JEWEL stash has just been redeemed for {redeemed_value/1e18:.3f}. Need to be quicker next time!",
    )
    response = webhook.execute()
