import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { abis, addresses } from "../../utils/env";

export function useLPToken(
  LPToken: string,
  poolId: number
): {
  balance: BigNumber | undefined;
  allowance: BigNumber | undefined;
  stakedSupply: BigNumber | undefined;
  stakedBalance: BigNumber | undefined;
  pendingReward: BigNumber | undefined;
} {
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
  const [{ data: stakedBalance }] = useContractRead(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "userInfo",
    { watch: true, args: userStaked }
  );

  const [{ data: balance }] = useContractRead(
    {
      addressOrName: LPToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    {
      watch: true,
      args: user,
    }
  );

  const [{ data: allowance }] = useContractRead(
    {
      addressOrName: LPToken,
      contractInterface: abis.ERC20,
    },
    "allowance",
    {
      watch: true,
      args: userMaster,
    }
  );

  const [{ data: stakedSupply }] = useContractRead(
    {
      addressOrName: LPToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    {
      watch: true,
      args: onMaster,
    }
  );

  const [{ data: pendingReward }] = useContractRead(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "pendingToken",
    {
      watch: true,
      args: userStaked,
    }
  );

  return {
    balance: balance as any,
    allowance: allowance as any,
    stakedSupply: stakedSupply as any,
    stakedBalance: stakedBalance && (stakedBalance[0] as any),
    pendingReward: pendingReward as any,
  };
}
