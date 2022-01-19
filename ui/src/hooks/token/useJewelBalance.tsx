import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import { abis } from "../../utils/contracts";

export function useJewelBalance(): [{
  combinedBalance: BigNumber | undefined;
  lockedBalance: BigNumber | undefined;
  unlockedBalance: BigNumber | undefined;
}, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: accountData }] = useAccount();

  const [{ data: combinedBalance }, readCombinedBalance] = useContractRead(
    {
      addressOrName: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
      contractInterface: abis.JewelToken,
    },
    "totalBalanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );
  const [{ data: lockedBalance }, readLockedBalance] = useContractRead(
    {
      addressOrName: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
      contractInterface: abis.JewelToken,
    },
    "lockOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );
  const [{ data: unlockedBalance }, readUnlockedBalance] = useContractRead(
    {
      addressOrName: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
      contractInterface: abis.JewelToken,
    },
    "balanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

    Promise.allSettled([
      readCombinedBalance({args: [accountData?.address]}),
      readLockedBalance({args: [accountData?.address]}),
      readUnlockedBalance({args: [accountData?.address]})
    ])
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      readCombinedBalance({args: [accountData?.address]}),
      readLockedBalance({args: [accountData?.address]}),
      readUnlockedBalance({args: [accountData?.address]})
    ]).finally(() => setLoading(false));
  }, [accountData?.address])

  return [
    {
      combinedBalance: combinedBalance as any,
      lockedBalance: lockedBalance as any,
      unlockedBalance: unlockedBalance as any,
    },
    loading,
  ];
}
