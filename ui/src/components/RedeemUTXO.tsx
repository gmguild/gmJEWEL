import { BigNumber } from "ethers";
import React, { useMemo } from "react";
import { useGmJewelBalance } from "../hooks/token/useGmJewelBalance";
import { useFormattedBigNumber } from "../hooks/util/useFormattedBigNumber";
import { FullUTXO } from "../hooks/utxo/types";
import { useGetAllUTXOs } from "../hooks/utxo/useGetAllUTXOs";
import { useRedeemFromUTXO } from "../hooks/utxo/useRedeemFromUTXO";
import { JewelStash } from "./JewelStash";
import { classNames } from "../utils/classNames";
import { BigNumberToFloat, shortenAddress } from "../utils/conversion";
import { Button } from "./Button";
import { ethers } from "@usedapp/core/node_modules/ethers";

export function RedeemUTXO() {
  const [allUTXOs, loadingAllUTXOs, forceRefreshAllUTXOs] = useGetAllUTXOs();
  const [{ balance: gmBalance }, loadingGmJewelBalance] = useGmJewelBalance();

  const [selectedUTXO, setSelectedUTXO] = React.useState<FullUTXO | null>(null);

  const [redeemUTXO, redeemingUTXO] = useRedeemFromUTXO(
    selectedUTXO?.utxoAddress ?? "0x",
    BigNumber.from(0)
  );

  const formattedGmBalance = useFormattedBigNumber(gmBalance);
  const formattedSelectedUTXOValue = useFormattedBigNumber(
    selectedUTXO?.newVal
  );

  const costToBuy = useMemo(() => {
    if (!selectedUTXO) return "";
    if (selectedUTXO.newVal == "") return "";
    const price = BigNumberToFloat(BigNumber.from(selectedUTXO.newVal));
    // todo: don't hardcode fee tiers
    const fee = getFees(price);
    return ethers.utils.parseEther((price * (1 + fee)).toString());
  }, [selectedUTXO]);

  const formattedCostToBuy = useMemo(() => {
    if (!costToBuy) return "";
    if (!gmBalance) return "";
    const colour = costToBuy.lt(gmBalance) ? "text-green-500" : "text-red-500";
    return (
      <span className={classNames(colour)}>
        {BigNumberToFloat(costToBuy).toFixed(3)} gmJEWEL
      </span>
    );
  }, [costToBuy, gmBalance]);

  const loadingInformation = loadingAllUTXOs || loadingGmJewelBalance;
  const doing = loadingInformation || redeemingUTXO;

  const redeemStash = () =>
    redeemUTXO().then(() => {
      forceRefreshAllUTXOs();
      setSelectedUTXO(null);
    });
  const redeemDisabled =
    doing ||
    (!!gmBalance && !!costToBuy && BigNumber.from(gmBalance).lt(costToBuy));

  return (
    <div className="max-w-5xl mx-auto font-lora p-4">
      <article className={classNames("py-6 prose")}>
        <p className="flex flex-row text-center mx-auto">
          Your Balance (gmJEWEL) is{" "}
          <span className="ml-2 text-gray-900 flex flex-row items-center">
            <div className="jewel-icon h-4 w-4 mr-1" />{" "}
            {!loadingInformation ? formattedGmBalance : "...loading..."}
          </span>
        </p>
      </article>

      <p className="text-center">Please select a Stash to redeem</p>

      <div className="w-full grid grid-cols-12 my-4">
        <div
          className={classNames(
            "col-span-12 md:col-span-6 lg:col-span-4",
            !selectedUTXO && "flex flex-row items-center justify-center",
            selectedUTXO && "p-4"
          )}
        >
          {!selectedUTXO && <p className="italic">No Stash selected</p>}
          {selectedUTXO && (
            <>
              <p className="italic text-center mb-1">Selected stash</p>
              <p className="text-center mb-1">
                <a
                  className="text-center underline font-bold text-gray-900 hover:text-blue-500"
                  target="_blank"
                  href={`https://explorer.harmony.one/address/${selectedUTXO.utxoAddress}`}
                  rel="noreferrer"
                >
                  {shortenAddress(selectedUTXO.utxoAddress)}
                </a>
              </p>

              <p className="flex flex-row mb-1">
                <span className="text-gray-500">Value</span>{" "}
                <span className="ml-2 text-gray-900 flex flex-row items-center">
                  <div className="jewel-icon h-4 w-4 mr-1" />{" "}
                  {!loadingInformation
                    ? formattedSelectedUTXOValue
                    : "...loading..."}
                </span>
              </p>

              <p className="flex flex-row mb-2">
                <span className="text-gray-500">Cost</span>{" "}
                <span className="ml-2 text-gray-900 flex flex-row items-center">
                  <div className="jewel-icon h-4 w-4 mr-1" />{" "}
                  {!loadingInformation ? formattedCostToBuy : "...loading..."}
                </span>
              </p>

              <Button
                className="mx-auto"
                disabled={redeemDisabled}
                onClick={redeemStash}
              >
                Redeem Stash
              </Button>
            </>
          )}
        </div>

        <div
          className={classNames(
            "flex flex-row flex-wrap gap-4 col-span-12 md:col-span-6 lg:col-span-8"
          )}
        >
          {loadingAllUTXOs && (
            <p className="text-center">...loading stashes...</p>
          )}
          {allUTXOs.map((utxo, i) => {
            return (
              <JewelStash
                key={i}
                selected={
                  !!selectedUTXO &&
                  selectedUTXO.utxoAddress === utxo.utxoAddress
                }
                onClick={() => setSelectedUTXO(utxo)}
                utxo={utxo}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
