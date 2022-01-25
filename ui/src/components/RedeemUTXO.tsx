import { BigNumber } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { useGmJewelBalance } from "../hooks/token/useGmJewelBalance";
import { useFormattedBigNumber } from "../hooks/util/useFormattedBigNumber";
import { FullUTXO } from "../hooks/utxo/types";
import { useGetAllUTXOs } from "../hooks/utxo/useGetAllUTXOs";
import { useRedeemFromUTXO } from "../hooks/utxo/useRedeemFromUTXO";
import { JewelStash } from "./JewelStash";
import { classNames } from "../utils/classNames";
import { bigNumberMin, bigNumberToFloat, shortenAddress } from "../utils/conversion";
import { Button } from "./Button";
import { ethers } from "@usedapp/core/node_modules/ethers";
import { getFees } from "../utils/fees";
import { useJewelBalance } from "../hooks/token/useJewelBalance";
import { useERC20Approve } from "../hooks/token/useERC20Approve";
import { addresses } from "../utils/env";
import { useERC20 } from "../hooks/token/useERC20";

export function RedeemUTXO() {
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

  const [allUTXOs, loadingAllUTXOs, forceRefreshAllUTXOs] = useGetAllUTXOs();
  const [{ unlockedBalance: jewelBalance }, loadingJewelBalance] = useJewelBalance();
  const [{ balance: gmBalance }, loadingGmJewelBalance] = useGmJewelBalance();

  const [{allowance: jewelAllowanceAtPawnShop}, loadingJewelToken] = useERC20(addresses.JewelToken, addresses.PawnShop);
  const [approveJewelAtPawnShop, approvingJewel] = useERC20Approve(addresses.JewelToken, addresses.PawnShop);

  const [selectedUTXO, setSelectedUTXO] = React.useState<FullUTXO | null>(null);
  const [jewelAmount, setSelectedJewelAmount] = React.useState<BigNumber | null>(null)

  const [redeemUTXO, redeemingUTXO] = useRedeemFromUTXO(
    selectedUTXO?.utxoAddress ?? "0x",
    jewelAmount ?? BigNumber.from(0)
  );

  const formattedJewelBalance = useFormattedBigNumber(jewelBalance);
  const formattedGmBalance = useFormattedBigNumber(gmBalance);
  const formattedSelectedUTXOValue = useFormattedBigNumber(
    selectedUTXO?.newVal
  );

  const {costToBuy, price, fee} = useMemo(() => {
    if (!selectedUTXO) return {};
    if (selectedUTXO.newVal == "") return {};
    const price = bigNumberToFloat(BigNumber.from(selectedUTXO.newVal));
    // todo: don't hardcode fee tiers
    const fee = getFees(price);
    const costToBuy = ethers.utils.parseEther((price * (1 + fee)).toString());
    return {costToBuy, price, fee}
  }, [selectedUTXO]);

  const {formattedCostToBuy, formattedJewelCost, formattedGmJewelCost} = useMemo(() => {
    if (!costToBuy?._isBigNumber) return {};
    if (!gmBalance?._isBigNumber) return {};
    if (!jewelAmount?._isBigNumber) return {};
    if (!jewelBalance?._isBigNumber) return {};

    const totalCostColour = costToBuy.lte(gmBalance.add(jewelBalance)) ? "text-green-500" : "text-red-500";
    const jewelCostColour = jewelAmount.lte(jewelBalance) ? "text-green-500" : "text-red-500";
    const gmJewelCostColour = costToBuy.sub(jewelAmount).lte(gmBalance) ? "text-green-500" : "text-red-500";

    return {
      formattedCostToBuy: (
        <span className={classNames(totalCostColour)}>
          {bigNumberToFloat(costToBuy).toFixed(3)}
        </span>
      ),
      formattedJewelCost: (
        <span className={classNames(jewelCostColour)}>
          {bigNumberToFloat(jewelAmount).toFixed(3)}
        </span>
      ),
      formattedGmJewelCost: (
        <span className={classNames(gmJewelCostColour)}>
          {bigNumberToFloat(costToBuy.sub(jewelAmount)).toFixed(3)}
        </span>
      ),
    };
  }, [costToBuy, price, fee, jewelAmount, gmBalance]);

  useEffect(() => {
    if(price) {
      const feeAmount = ethers.utils.parseEther((price * (fee || 0)).toFixed(18))
      setSelectedJewelAmount(feeAmount);
    } else {
      setSelectedJewelAmount(null);
    }
  }, [price, fee])

  const loadingInformation = loadingAllUTXOs || loadingGmJewelBalance || loadingJewelBalance || loadingJewelToken;
  const doing = loadingInformation || redeemingUTXO || approvingJewel;

  const redeemStash = () =>
    redeemUTXO().then((success) => {
      if(!success) return
      console.log(success)
      forceRefreshAllUTXOs();
      setSelectedUTXO(null);
    });

  const pawnShopAllowanceTooLow = jewelAmount?._isBigNumber && jewelAllowanceAtPawnShop?._isBigNumber && jewelAllowanceAtPawnShop.lt(jewelAmount);
  const redeemDisabled = doing
    || (gmBalance?._isBigNumber && costToBuy?._isBigNumber && BigNumber.from(gmBalance.add(jewelBalance ?? BigNumber.from(0))).lt(costToBuy))
    || (jewelAmount?._isBigNumber && jewelBalance?._isBigNumber && jewelBalance.lt(jewelAmount))
    || (jewelAmount?._isBigNumber && gmBalance?._isBigNumber && costToBuy?._isBigNumber && gmBalance.lt(costToBuy.sub(jewelAmount)));

  return (
    <>
      <div className="max-w-5xl mx-auto font-lora p-4">
        <article className={classNames("py-6 prose mx-auto")}>
          <p className="flex flex-row justify-center mx-auto">
            Your JEWEL balance is{" "}
            <span className="ml-2 text-gray-900 flex flex-row items-center">
              <div className="jewel-icon h-4 w-4 mr-1" />{" "}
              {!loadingInformation ? formattedJewelBalance : "...loading..."}
            </span>
          </p>
          <p className="flex flex-row justify-center mx-auto">
            Your gmJEWEL balance is{" "}
            <span className="ml-2 text-gray-900 flex flex-row items-center">
              <div className="locked-jewel-icon h-4 w-4 mr-1" />{" "}
              {!loadingInformation ? formattedGmBalance : "...loading..."}
            </span>
          </p>

          <p className="text-center">Please select a Stash to redeem</p>
        </article>

        <div className="w-full my-4 mt-0">
          <div
            className={classNames(
              "mx-auto max-w-xl",
              !selectedUTXO && "flex flex-row my-8 justify-center",
              selectedUTXO && "p-4 mb-4 flex flex-col items-center"
            )}
          >
            {!selectedUTXO && <p className="italic">No Stash selected</p>}
            {selectedUTXO && (
              <>
                <p className="italic mb-1">Selected stash</p>
                <p className="mb-4">
                  <a
                    className="underline font-bold text-gray-900 hover:text-blue-500"
                    target="_blank"
                    href={`https://explorer.harmony.one/address/${selectedUTXO.utxoAddress}`}
                    rel="noreferrer"
                  >
                    {shortenAddress(selectedUTXO.utxoAddress)}
                  </a>
                </p>

                <p className="flex flex-row mb-2">
                  <span className="text-gray-500">Value</span>{" "}
                  <span className="ml-2 text-gray-900 flex flex-row items-center">
                    <div className="locked-jewel-icon h-4 w-4 mr-1" />{" "}
                    {!loadingInformation
                      ? formattedSelectedUTXOValue
                      : "...loading..."}
                  </span>
                </p>

                <p className="flex flex-row mb-2">
                  <span className="text-gray-500">TOTAL Cost</span>{" "}
                  <span className="ml-2 text-gray-900 flex flex-row items-center">
                    <div className="locked-jewel-icon h-4 w-4 mr-1" />{" "}
                    {!loadingInformation ? formattedCostToBuy : "...loading..."}
                  </span>
                </p>
                <p className="flex flex-row mb-2">
                  <span className="text-gray-500">Cost Paid in JEWEL</span>{" "}
                  <span className="ml-2 text-gray-900 flex flex-row items-center">
                    <div className="locked-jewel-icon h-4 w-4 mr-1" />{" "}
                    {!loadingInformation ? formattedJewelCost : "...loading..."}
                  </span>
                </p>
                <p className="flex flex-row mb-1">
                  <span className="text-gray-500">Cost Paid in gmJEWEL</span>{" "}
                  <span className="ml-2 text-gray-900 flex flex-row items-center">
                    <div className="locked-jewel-icon h-4 w-4 mr-1" />{" "}
                    {!loadingInformation ? formattedGmJewelCost : "...loading..."}
                  </span>
                </p>

                <div className="flex flex-row justify-end mb-2">
                  <button
                    className="text-center text-gray-500 cursor-pointer text-sm px-2 py-2"
                    onClick={() => setAdvancedSectionOpen((open) => !open)}
                  >
                    ADVANCED OPTIONS {advancedSectionOpen ? "-" : "+"}
                  </button>
                </div>

                <div className={classNames(!advancedSectionOpen && "hidden", "mb-4")}>
                  <p className="text-sm">Adjust JEWEL Ratio</p>
                  {(costToBuy && jewelAmount && price && fee) ? (
                    <input
                      type="range"
                      min={bigNumberToFloat(ethers.utils.parseEther((price * (fee || 0)).toFixed(18)))}
                      max={bigNumberToFloat(costToBuy)}
                      value={bigNumberToFloat(jewelAmount)}
                      onChange={(e) => setSelectedJewelAmount(ethers.utils.parseEther(e.target.value))}
                    />
                  ) : (
                    <p>...loading...</p>
                  )}
                </div>

                <div className="flex flex-row justify-center gap-2 flex-wrap">
                  {jewelBalance?.gt(0) && (
                    <Button
                      className="mx-auto"
                      disabled={doing || redeemDisabled || !pawnShopAllowanceTooLow}
                      onClick={() => approveJewelAtPawnShop()}
                      >
                      Approve JEWEL
                    </Button>
                  )}

                  <Button
                    className="mx-auto"
                    disabled={redeemDisabled || pawnShopAllowanceTooLow}
                    onClick={redeemStash}
                    >
                    Redeem Stash
                  </Button>
                </div>
              </>
            )}
          </div>

          <div
            className={classNames(
              "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            )}
          >
            {loadingAllUTXOs && (
              <p className="text-center">...loading stashes...</p>
            )}
            {allUTXOs.map((utxo, i) => (
                <JewelStash
                  key={i}
                  selected={
                    !!selectedUTXO &&
                    selectedUTXO.utxoAddress === utxo.utxoAddress
                  }
                  onClick={() => setSelectedUTXO(utxo)}
                  utxo={utxo}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

