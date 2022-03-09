import { BigNumber } from "ethers";
import React, { useMemo } from "react";
import { FullUTXO, UTXO } from "../hooks/utxo/types";
import { useGetUTXOsForUser } from "../hooks/utxo/useGetUTXOsForUser";
import { useMintFromUTXO } from "../hooks/utxo/useMintFromUTXO";
import { useSendJewelToUTXO } from "../hooks/utxo/useSendJewelToUTXO";
import { useCreateUTXO } from "../hooks/utxo/useCreateUTXO";
import { useUTXOMintedAmount } from "../hooks/utxo/useUTXOMintedAmount";
import { useUTXOValues } from "../hooks/utxo/useUTXOValue";
import { useJewelBalance } from "../hooks/token/useJewelBalance";
import { classNames } from "../utils/classNames";
import { useFormattedBigNumber } from "../hooks/util/useFormattedBigNumber";
import { JewelStash } from "./JewelStash";
import { Button } from "./Button";

export function CreateUTXO() {
  const [createUTXO, creatingUTXO] = useCreateUTXO();
  const [userUTXOs, loadingUserUTXOs, forceRefreshUTXOs] = useGetUTXOsForUser();
  const [selectedUTXO, setSelectedUTXO] = React.useState<FullUTXO | null>(null);

  const maxUTXOsReached = userUTXOs.length >= 8;

  return (
    <div className="max-w-4xl mx-auto font-lora p-4">
      <MintUTXOInfo />
      {userUTXOs.length > 0 && !loadingUserUTXOs ? (
        <p className="text-center">Your Jewel Stashes</p>
      ) : (
        <p className="text-center">Please create a Stash</p>
      )}
      <div
        className={classNames(
          "flex flex-row flex-wrap justify-center my-4 mx-auto gap-4"
        )}
      >
        {loadingUserUTXOs && (
          <p className="text-center">...loading your stashes...</p>
        )}
        {userUTXOs.map((utxo, key) => {
          return (
            <JewelStash
              key={key}
              utxo={utxo}
              selected={
                !!selectedUTXO && selectedUTXO.utxoAddress === utxo.utxoAddress
              }
              onClick={() => setSelectedUTXO(utxo)}
            />
          );
        })}
      </div>
      <Button
        className="mx-auto"
        onClick={() => createUTXO().then(() => forceRefreshUTXOs())}
        disabled={creatingUTXO || maxUTXOsReached}
      >
        {maxUTXOsReached ? "Max Stashes Reached" : "Create Jewel Stash"}
      </Button>
      {selectedUTXO && (
        <ActiveUTXO utxo={selectedUTXO} forceRefreshUTXOs={forceRefreshUTXOs} />
      )}
    </div>
  );
}

export function MintUTXOInfo() {
  return (
    <article className={classNames("py-6 prose")}>
      <p>
        In order to mint <span>gmJEWEL</span>, there are three very important
        steps you must take:
      </p>
      <ol>
        <li>You must create a Jewel Stash</li>
        <li>
          You must transfer your locked Jewel to the Jewel Stash
          <aside className="italic">
            Please note the function that allows you to transfer locked Jewel
            ALSO{" "}
            <span className="underline">
              transfers all the unlocked Jewel in your balance!
            </span>{" "}
            Please deposit any unlocked Jewel in the bank first.
          </aside>
        </li>
        <li>
          You will then be able to mint <span>gmJEWEL</span> at a 1:1 ratio
          <aside className="italic">
            Please also note that while you are the &quot;minter&quot; of these
            stashes,{" "}
            <span className="underline">
              anybody can redeem them for the underlying Jewel!
            </span>
          </aside>
        </li>
      </ol>
    </article>
  );
}

function ActiveUTXO({
  utxo,
  forceRefreshUTXOs,
}: {
  utxo: UTXO;
  forceRefreshUTXOs: () => void;
}) {
  const [{ utxoValue }, loadingUTXOValue] = useUTXOValues(utxo.utxoAddress);
  const [mintedAmount, loadingMintedAmount] = useUTXOMintedAmount(
    utxo.utxoAddress
  );
  const [{ combinedBalance, unlockedBalance, lockedBalance }, loadingBalances] =
    useJewelBalance();

  const [sendAllJewelToUTXO, sendingJewelToUTXO] = useSendJewelToUTXO(
    utxo.utxoAddress
  );
  const [mintFromUTXO, mintingFromUTXO] = useMintFromUTXO(utxo.utxoAddress);

  const loadingInformation =
    loadingBalances || loadingMintedAmount || loadingUTXOValue;

  const potentialMint = useMemo(() => {
    if (!utxoValue) return BigNumber.from(0);
    if (!mintedAmount) return BigNumber.from(0);
    return (utxoValue as unknown as BigNumber).sub(
      mintedAmount as unknown as BigNumber
    );
  }, [utxoValue, mintedAmount]);

  const formattedUTXOValue = useFormattedBigNumber(utxoValue);
  const formattedMintedAmount = useFormattedBigNumber(mintedAmount);
  const formattedLockedJewel = useFormattedBigNumber(lockedBalance);
  const formattedUnlockedJewel = useFormattedBigNumber(unlockedBalance);
  const formattedCombinedBalance = useFormattedBigNumber(combinedBalance);
  const formattedPotentialMint = useFormattedBigNumber(potentialMint);

  const doing = loadingInformation || sendingJewelToUTXO || mintingFromUTXO;

  return (
    <div
      className={classNames(
        "flex flex-1 flex-row flex-wrap justify-around py-6"
      )}
    >
      <div className="my-2">
        <h3 className="text-center italic mb-2">Your Inventory</h3>

        <p className="flex flex-row">
          <span className="text-gray-500">Locked Jewels</span>{" "}
          <span className="ml-2 text-gray-900 flex flex-row items-center">
            <div className="jewel-icon h-4 w-4 mr-1" />{" "}
            {!loadingInformation ? formattedLockedJewel : "...loading..."}
          </span>
        </p>
        <p className="flex flex-row">
          <span className="text-gray-500">Unlocked Jewels</span>{" "}
          <span className="ml-2 text-gray-900 flex flex-row items-center">
            <div className="jewel-icon h-4 w-4 mr-1" />{" "}
            {!loadingInformation ? formattedUnlockedJewel : "...loading..."}
          </span>
        </p>

        <Button
          className="mx-auto mt-2"
          disabled={combinedBalance?.eq(0) || doing}
          onClick={() => sendAllJewelToUTXO()}
        >
          Deposit{" "}
          {!loadingInformation ? formattedCombinedBalance : "...loading..."}
        </Button>
      </div>
      <div className="my-2">
        <h3 className="text-center italic mb-2">Jewel Stash</h3>

        <p className="flex flex-row">
          <span className="text-gray-500">Stash Value</span>{" "}
          <span className="ml-2 text-gray-900 flex flex-row items-center">
            <div className="jewel-icon h-4 w-4 mr-1" />{" "}
            {!loadingInformation ? formattedUTXOValue : "...loading..."}
          </span>
        </p>
        <p className="flex flex-row">
          <span className="text-gray-500">gmJEWEL Minted</span>{" "}
          <span className="ml-2 text-gray-900 flex flex-row items-center">
            <div className="locked-jewel-icon h-4 w-4 mr-1" />{" "}
            {!loadingInformation ? formattedMintedAmount : "...loading..."}
          </span>
        </p>

        <Button
          className="mx-auto mt-2"
          onClick={() => mintFromUTXO().then(() => forceRefreshUTXOs())}
          disabled={potentialMint.eq(0) || doing}
        >
          Mint {!loadingInformation ? formattedPotentialMint : "...loading..."}{" "}
          gmJEWEL
        </Button>
      </div>
    </div>
  );
}
