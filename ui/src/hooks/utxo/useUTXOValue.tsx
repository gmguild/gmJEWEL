import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber, useContractRead } from "wagmi";
import { abis } from "../../utils/env";

export function useUTXOValue(utxoAddress: string): [ethers.utils.Result | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: utxoValue }, read] = useContractRead(
    {
      addressOrName: utxoAddress,
      contractInterface: abis.UTXO,
    },
    "nominalCombinedValue",
    useMemo(() => ({ skip: true, overrides: { gasLimit: 1000000 } }), [])
  );

  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

    read()
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    read().finally(() => setLoading(false));
  }, [utxoAddress])

  return [utxoValue, !!loading];
}
