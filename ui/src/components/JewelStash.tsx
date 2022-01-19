import React from "react";
import { FullUTXO } from "../hooks/utxo/types";
import { shortenAddress } from "../utils/conversion";
import { classNames } from "../utils/classNames";
import { useFormattedBigNumber } from "../hooks/util/useFormattedBigNumber";
import { BigNumber } from "ethers";

export function JewelStash({ selected, utxo, onClick }: { selected?: boolean; utxo: FullUTXO; onClick?: () => void; }) {
  const formattedUtxoVal = useFormattedBigNumber(utxo.newVal);

  return (
    <div className={classNames(
      "bg-rune cursor-pointer p-8 rounded-md shadow-lg border-rune-edge border-8 flex flex-col items-center justify-center",
      selected && "border-rune-edge-light"
    )} onClick={() => onClick?.()}>
      <div className={
        classNames(
          "jewel-stash h-16 w-12",
          (!utxo.newVal || BigNumber.from(utxo.newVal).eq(0)) && 'grayscale'
        )
      } />
      <div className="text-gray-100 flex flex-row items-center"><div className="jewel-icon h-4 w-4 mr-3" /> {formattedUtxoVal}</div>
      <div className="text-gray-300/50">{shortenAddress(utxo.utxoAddress)}</div>
    </div>
  );
}
