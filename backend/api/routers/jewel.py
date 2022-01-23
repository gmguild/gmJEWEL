import os
from fastapi import APIRouter, Query
from sqlitedict import SqliteDict

router = APIRouter()

SCRIPT_DIR = os.path.dirname(__file__)  # <-- absolute dir the script is in
DB_FOLDER_PREFIX = os.path.join(SCRIPT_DIR, '../../db/jewel')

state_meta = SqliteDict(filename=os.path.join(DB_FOLDER_PREFIX, './state_meta.sqlite'),
                        autocommit=False,
                        flag="r", journal_mode="WAL")

state_utxo = SqliteDict(filename=os.path.join(DB_FOLDER_PREFIX, './state_utxo.sqlite'),
                        autocommit=False,
                        flag="r", journal_mode="WAL")

state_utxos_by_user = SqliteDict(filename=os.path.join(DB_FOLDER_PREFIX, './state_utxos_by_user.sqlite'),
                                 autocommit=False,
                                 flag="r", journal_mode="WAL")

state_utxo_redemptions = SqliteDict(filename=os.path.join(DB_FOLDER_PREFIX, './state_utxo_redemptions.sqlite'),
                                    autocommit=False,
                                    flag="r", journal_mode="WAL")


def _sort_by_size(e):
    if not "newVal" in e:
        return 0
    return int(e["newVal"])


@router.get("/utxo/list")
def get_all_utxos():
    return [v for [_, v] in state_utxo.items()]


@router.get("/utxo/minted")
def get_sorted_utxos():
    listed = [
        v for [_, v] in state_utxo.items()
        if "newVal" in v and int(v["newVal"]) > 0
    ]
    listed.sort(key=_sort_by_size, reverse=True)
    return listed


@router.get("/utxo/user")
def get_utxos_for_user(address):
    result = []
    if address.lower() in state_utxos_by_user and state_utxos_by_user[address.lower()] is not None:
        for utxo_address in state_utxos_by_user[address.lower()]:
            result.append(state_utxo[utxo_address])
        result.sort(key=_sort_by_size, reverse=True)
    return result


@router.get("/utxo/redemption-history")
def get_utxo_redemption_history(limit: int = Query(default=10, gt=0, le=100)):
    result = []

    last_utxo_redemption_index = int((
        state_meta["last_utxo_redemption_index"] if "last_utxo_redemption_index" in state_meta else "0"
    ) or "0")

    if last_utxo_redemption_index > 0:
        for i in range(last_utxo_redemption_index, last_utxo_redemption_index - limit, -1):
            if i not in state_utxo_redemptions:
                continue

            result.append(state_utxo_redemptions[i])

    return result
