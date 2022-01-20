import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { BigNumberToFloat } from "../../utils/conversion";
import { abis, addresses } from "../../utils/env";
import { MasterJewelerPool } from "../../utils/stakingpools";
import { usePrices } from "../token/usePrices";

export function useStakingAUM(poolId: number): number | undefined {
  const stakingPool = MasterJewelerPool[poolId];

  const [{ data: token0Amount }] = useContractRead(
    {
      addressOrName: stakingPool.token0,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({ watch: false, args: [stakingPool.lpToken] }), [])
  );

  const [{ data: token1Amount }] = useContractRead(
    {
      addressOrName: stakingPool.token1,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({ watch: false, args: [stakingPool.lpToken] }), [])
  );

  const [{ data: stakedLPTokens }] = useContractRead(
    {
      addressOrName: stakingPool.lpToken,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({ watch: false, args: [addresses.MasterJeweler] }), [])
  );

  const [{ data: totalLPTokens }] = useContractRead(
    {
      addressOrName: stakingPool.lpToken,
      contractInterface: abis.ERC20,
    },
    "totalSupply",
    useMemo(() => ({ watch: false }), [])
  );

  const [{ jewelPrice, gmJewelPriceInUSD, gmgPriceInUSD }] = usePrices();

  const getTokenPrice = (tokenAddress: string) => {
    if (tokenAddress == addresses.GMGToken) {
      return gmgPriceInUSD;
    } else if (tokenAddress == addresses.gmJEWEL) {
      return gmJewelPriceInUSD;
    } else if (tokenAddress == addresses.JewelToken) {
      return jewelPrice;
    } else {
      return undefined;
    }
  };

  const AUM = useMemo(() => {
    if (!totalLPTokens) return undefined;
    if (!stakedLPTokens) return undefined;
    if (!token0Amount) return undefined;
    if (!token1Amount) return undefined;
    const token0Price = getTokenPrice(stakingPool.token0);
    if (!token0Price) return undefined;
    const token1Price = getTokenPrice(stakingPool.token1);
    if (!token1Price) return undefined;
    // token0amount
    const t0a = BigNumberToFloat(token0Amount as unknown as BigNumber);
    // token1amount
    const t1a = BigNumberToFloat(token1Amount as unknown as BigNumber);
    // staked lp
    const slp = BigNumberToFloat(stakedLPTokens as unknown as BigNumber);
    // total lp
    const tlp = BigNumberToFloat(totalLPTokens as unknown as BigNumber);
    return token0Price * t0a + (token1Price * t1a * slp) / tlp;
  }, [totalLPTokens, stakedLPTokens, token0Amount, token1Amount]);

  return AUM;
}
