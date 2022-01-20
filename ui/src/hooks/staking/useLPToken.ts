import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import { abis, addresses } from "../../utils/env";

export function useLPToken(
  LPToken: string,
  poolId: number
): [{
  balance: BigNumber | undefined;
  allowance: BigNumber | undefined;
  stakedSupply: BigNumber | undefined;
  stakedBalance: BigNumber | undefined;
  pendingReward: BigNumber | undefined;
}, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: accountData }] = useAccount();
  const user = useMemo(() => [accountData?.address], [accountData?.address]);
  const onMaster = useMemo(() => [addresses.MasterJeweler], []);
  const userMaster = useMemo(
    () => [accountData?.address, addresses.MasterJeweler],
    [accountData?.address]
  );
  const userStaked = useMemo(
    () => [poolId, accountData?.address],
    [poolId, accountData?.address]
  );

  const [{ data: stakedBalance }, readStakedBalance] = useContractRead(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "userInfo",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const [{ data: balance }, readBalance] = useContractRead(
    {
      addressOrName: LPToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const [{ data: allowance }, readAllowance] = useContractRead(
    {
      addressOrName: LPToken,
      contractInterface: abis.ERC20,
    },
    "allowance",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const [{ data: stakedSupply }, readStakedSupply] = useContractRead(
    {
      addressOrName: LPToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const [{ data: pendingReward }, readPendingReward] = useContractRead(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "pendingToken",
    useMemo(() => ({
      skip: true,
    }), []),
  );


  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

    Promise.allSettled([
      readStakedBalance({args: userStaked}),
      readBalance({args: user}),
      readAllowance({args: userMaster}),
      readStakedSupply({args: onMaster}),
      readPendingReward({args: userStaked}),
    ])
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      readStakedBalance({args: userStaked}),
      readBalance({args: user}),
      readAllowance({args: userMaster}),
      readStakedSupply({args: onMaster}),
      readPendingReward({args: userStaked}),
    ]).finally(() => setLoading(false));
  }, [userStaked, user, userMaster, onMaster, userStaked])

  return [{
    balance: balance as any,
    allowance: allowance as any,
    stakedSupply: stakedSupply as any,
    stakedBalance: stakedBalance && (stakedBalance[0] as any),
    pendingReward: pendingReward as any,
  }, loading];
}
