import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber, useContractRead } from "wagmi";
import { B_1 } from "../../utils/constants";
import { abis, addresses } from "../../utils/env";

export function usexGMGToken(): [{
  stakedBalance: BigNumber | undefined;
  stakingTokens: BigNumber | undefined;
  ratio: BigNumber | undefined;
}, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: stakedBalance }, readStakedBalance] = useContractRead(
    {
      addressOrName: addresses.GMGToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const [{ data: stakingToken }, readStakingToken] = useContractRead(
    {
      addressOrName: addresses.xGMG,
      contractInterface: abis.xGMG,
    },
    "totalSupply",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const ratio = useMemo(() => {
    if (!stakedBalance) return B_1;
    if (!stakingToken) return B_1;
    if (stakingToken.eq(BigNumber.from(0))) return B_1;
    return stakedBalance.mul(B_1).div(stakingToken);
  }, [stakingToken, stakedBalance]);

  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

    Promise.allSettled([
      readStakedBalance({args: [addresses.xGMG]}),
      readStakingToken(),
    ])
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      readStakedBalance({args: [addresses.xGMG]}),
      readStakingToken(),
    ]).finally(() => setLoading(false));
  }, [])

  return [{
    stakingTokens: stakingToken as any,
    stakedBalance: stakedBalance as any,
    ratio: ratio as any,
  }, loading];
}
