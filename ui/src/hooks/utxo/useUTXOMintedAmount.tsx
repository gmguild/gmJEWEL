import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber, useContractRead } from "wagmi";
import { abis, addresses } from "../../utils/env";

export function useUTXOMintedAmount(utxoAddress: string): [ethers.utils.Result | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: mintedAmount }, read] = useContractRead(
    {
      addressOrName: addresses.PawnShop,
      contractInterface: abis.PawnShop,
    },
    "mintedFromUTXO",
    useMemo(() => ({
      skip: true,
      overrides: { gasLimit: 1000000 },
    }), [])
  );

  useEffect(() => {
    if(!blockNumber) return;
    if(!loading) return;

    read({ args: [utxoAddress] })
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    read({ args: [utxoAddress] }).finally(() => setLoading(false));
  }, [utxoAddress])

  return [mintedAmount, !!loading];
}
