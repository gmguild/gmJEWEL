import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useBlockNumber, useContractRead } from "wagmi";
import { BLOCKS_PER_YEAR } from "../../utils/constants";
import { BigNumberToFloat } from "../../utils/conversion";
import { abis, addresses } from "../../utils/env";
import { usePrices } from "../token/usePrices";
import { getEmissionRate } from "../util/getEmissionRate";
import { useStakingAUM } from "./useStakingAUM";

export function useStakingAPY(poolId: number): number | undefined {
  const AUM = useStakingAUM(poolId);

  const [{ data: blockNumber }] = useBlockNumber({
    watch: true,
  });
  const emissionRate = getEmissionRate(blockNumber ?? 0);

  const [{ data: allocationPoint }] = useContractRead(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "poolInfo",
    useMemo(
      () => ({
        watch: false,
        args: [poolId],
      }),
      [poolId]
    )
  );

  const [{ data: totalAllocation }] = useContractRead(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "totalAllocPoint",
    useMemo(
      () => ({
        watch: false,
      }),
      []
    )
  );

  const allocationRatio = useMemo(() => {
    if (!allocationPoint) return undefined;
    if (!totalAllocation) return undefined;
    return (
      BigNumberToFloat(allocationPoint.allocPoint as unknown as BigNumber) /
      BigNumberToFloat(totalAllocation as unknown as BigNumber)
    );
  }, [allocationPoint, totalAllocation]);

  //   Number of tokens that pool produces
  const tokensEmitted = useMemo(() => {
    if (!allocationRatio) return undefined;
    return BLOCKS_PER_YEAR * allocationRatio * emissionRate;
  }, [allocationRatio]);

  // get GMG price
  const [{ gmgPriceInUSD: price }] = usePrices();

  //   get AUM

  const APY = useMemo(() => {
    if (!tokensEmitted) return undefined;
    if (!price) return undefined;
    if (!AUM) return undefined;
    return (tokensEmitted * price) / AUM;
  }, [tokensEmitted, price, AUM]);

  return APY;
}
