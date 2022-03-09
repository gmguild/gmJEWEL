import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber, useContractRead } from "wagmi";
import { abis, addresses } from "../../utils/env";

export function useUTXOValues(utxoAddress: string): [
  {
    feeToPay: ethers.BigNumber | undefined;
    utxoValue: ethers.BigNumber | undefined;
    mintedAmount: ethers.BigNumber | undefined;
  },
  boolean
] {
  const [loading, setLoading] = useState(true);
  const [{ data: blockNumber }] = useBlockNumber({
    watch: true,
  });
  const [{ data: utxoValues }, read] = useContractRead(
    {
      addressOrName: addresses.PawnShopRouter,
      contractInterface: abis.PawnShopRouter,
    },
    "utxoValues",
    useMemo(
      () => ({
        skip: true,
        overrides: { gasLimit: 1000000 },
        args: utxoAddress,
      }),
      [utxoAddress]
    )
  );

  useEffect(() => {
    if (!blockNumber) return;
    if (loading) return;

    read();
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    read().finally(() => setLoading(false));
  }, [utxoAddress]);

  if (!utxoValues) {
    return [
      { feeToPay: undefined, utxoValue: undefined, mintedAmount: undefined },
      !!loading,
    ];
  }

  return [
    {
      feeToPay: utxoValues[0] as any,
      utxoValue: utxoValues[1] as any,
      mintedAmount: utxoValues[2] as any,
    },
    !!loading,
  ];
}
