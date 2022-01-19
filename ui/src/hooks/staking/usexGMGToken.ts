import { BigNumber, utils } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { B_1 } from "../../utils/constants";
import { abis, addresses } from "../../utils/contracts";

export function usexGMGToken(): {
  stakedBalance: BigNumber | undefined;
  stakingTokens: BigNumber | undefined;
  ratio: BigNumber | undefined;
} {
  const [{ data: stakedBalance }] = useContractRead(
    {
      addressOrName: addresses.GMGToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    { watch: true, args: addresses.xGMG }
  );

  const [{ data: stakingToken }] = useContractRead(
    {
      addressOrName: addresses.xGMG,
      contractInterface: abis.xGMG,
    },
    "totalSupply",
    {
      watch: true,
    }
  );

  const ratio = useMemo(() => {
    if (!stakedBalance) return B_1;
    if (!stakingToken) return B_1;
    if (stakingToken.eq(BigNumber.from(0))) return B_1;
    return stakedBalance.mul(B_1).div(stakingToken);
  }, [stakingToken, stakedBalance]);

  return {
    stakingTokens: stakingToken as any,
    stakedBalance: stakedBalance as any,
    ratio: ratio as any,
  };
}
