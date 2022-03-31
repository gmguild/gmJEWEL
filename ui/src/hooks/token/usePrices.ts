import { useMemo } from "react";
import { useSingleCallResult } from "../../state/multicall/hooks";
import { B_1 } from "../../utils/constants";
import { bigNumberToFloat } from "../../utils/conversion";
import { abis, addresses } from "../../utils/env";
import { useContract } from "../contract/useContract";

export function usePrices(): [
  {
    jewelPrice: number | undefined;
    gmJewelPriceInJewel: number | undefined;
    gmJewelPriceInUSD: number | undefined;
    gmgPriceInJewel: number | undefined;
    gmgPriceInUSD: number | undefined;
  },
  boolean
] {
  const jewelUsdContract = useContract(
    "0xA1221A5BBEa699f507CC00bDedeA05b5d2e32Eba",
    abis.UniswapV2Pair
  );
  const { result: jewelUsdcReserves } = useSingleCallResult(
    jewelUsdContract,
    "getReserves"
  );

  const jewelPrice = useMemo(() => {
    if (!jewelUsdcReserves) return undefined;
    if (!jewelUsdcReserves[0]) return undefined;
    if (!jewelUsdcReserves[1]) return undefined;
    return bigNumberToFloat(
      jewelUsdcReserves[1].mul(B_1).div(jewelUsdcReserves[0] || 1),
      6
    );
  }, [jewelUsdcReserves]);

  const jewelGmJewelContract = useContract(
    addresses.JgmJLPToken,
    abis.UniswapV2Pair
  );
  const { result: jewelgmJewelReserves } = useSingleCallResult(
    jewelGmJewelContract,
    "getReserves"
  );

  const gmJewelPriceInJewel = useMemo(() => {
    if (!jewelgmJewelReserves) return undefined;
    if (!jewelgmJewelReserves[0]) return undefined;
    if (!jewelgmJewelReserves[1]) return undefined;
    return bigNumberToFloat(
      jewelgmJewelReserves[1].mul(B_1).div(jewelgmJewelReserves[0] || 1),
      18
    );
  }, [jewelgmJewelReserves]);

  const gmJewelPriceInUSD = useMemo(() => {
    if (!gmJewelPriceInJewel) return undefined;
    if (!jewelPrice) return undefined;
    return gmJewelPriceInJewel * jewelPrice;
  }, [gmJewelPriceInJewel, jewelPrice]);

  const jewelGMGContract = useContract(
    addresses.JGMGLPToken,
    abis.UniswapV2Pair
  );
  const { result: gmgReserves } = useSingleCallResult(
    jewelGMGContract,
    "getReserves"
  );

  const gmgPriceInJewel = useMemo(() => {
    if (!gmgReserves) return undefined;
    if (!gmgReserves[0]) return undefined;
    if (!gmgReserves[1]) return undefined;
    if (!jewelPrice) return undefined;
    return bigNumberToFloat(
      gmgReserves[0].mul(B_1).div(gmgReserves[1] || 1),
      18
    );
  }, [gmgReserves]);

  const gmgPriceInUSD = useMemo(() => {
    if (!gmgPriceInJewel) return undefined;
    if (!jewelPrice) return undefined;
    return gmgPriceInJewel * jewelPrice;
  }, [gmgPriceInJewel, jewelPrice]);

  return [
    {
      jewelPrice,
      gmJewelPriceInJewel,
      gmJewelPriceInUSD,
      gmgPriceInJewel,
      gmgPriceInUSD,
    },
    jewelPrice === undefined,
  ];
}
