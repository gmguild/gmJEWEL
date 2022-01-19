import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import { abis, addresses } from "../../utils/env";

export function useGmJewelBalance(): [{ balance: BigNumber | undefined }, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: accountData }] = useAccount();

  const [{ data: balance }, read] = useContractRead(
    {
      addressOrName: addresses.gmJEWEL,
      contractInterface: abis.gmJEWEL,
    },
    "balanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

   read({ args: [accountData?.address] })
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    read({args: [accountData?.address]}).finally(() => setLoading(false));
  }, [accountData?.address])

  return [{
    balance: balance as any,
  }, loading];
}
