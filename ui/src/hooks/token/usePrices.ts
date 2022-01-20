import { useEffect, useMemo, useState } from "react";
import { useBlockNumber, useContractRead } from "wagmi";
import { B_1 } from "../../utils/constants";
import { BigNumberToFloat } from "../../utils/conversion";
import { abis, addresses } from "../../utils/env";

export function usePrices(): [{
  jewelPrice: number | undefined;
  gmJewelPriceInJewel: number | undefined;
  gmgPriceInJewel: number | undefined;
}, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });

  const [{ data: jewelUsdcReserves }, readJewelUsdcReserves] = useContractRead(
    {
      // jewel-1usdc
      addressOrName: "0xA1221A5BBEa699f507CC00bDedeA05b5d2e32Eba",
      contractInterface: abis.UniswapV2Pair,
    },
    "getReserves",
    useMemo(() => ({
      skip: true,
    }), [] )
  );

  const jewelPrice = useMemo(() => {
    if (!jewelUsdcReserves) return undefined;
    if (!jewelUsdcReserves[0]) return undefined;
    if (!jewelUsdcReserves[1]) return undefined;
    return BigNumberToFloat(
      jewelUsdcReserves[1].mul(B_1).div(jewelUsdcReserves[0] || 1),
      6
    );
  }, [jewelUsdcReserves]);

  const [{ data: jewelgmJewelReserves }, readJewelGmJewelReserves] = useContractRead(
    {
      // jewel-gmJewel
      addressOrName: addresses.JgmJLPToken,
      contractInterface: abis.UniswapV2Pair,
    },
    "getReserves",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  const gmJewelPriceInJewel = useMemo(() => {
    if (!jewelgmJewelReserves) return undefined;
    if (!jewelgmJewelReserves[0]) return undefined;
    if (!jewelgmJewelReserves[1]) return undefined;
    return BigNumberToFloat(
      jewelgmJewelReserves[0].mul(B_1).div(jewelgmJewelReserves[1] || 1),
      18
    );
  }, [jewelgmJewelReserves]);

  const [{ data: gmgReserves }, readJewelGmgReserves] = useContractRead(
    {
      // jewel-GMG
      addressOrName: addresses.JGMGLPToken,
      contractInterface: abis.UniswapV2Pair,
    },
    "getReserves",
    useMemo(() => ({
      skip: true,
    }), []),
  );
  const gmgPriceInJewel = useMemo(() => {
    if (!gmgReserves) return undefined;
    if (!gmgReserves[0]) return undefined;
    if (!gmgReserves[1]) return undefined;
    if (!jewelPrice) return undefined;
    return BigNumberToFloat(gmgReserves[0].mul(B_1).div(gmgReserves[1] || 1), 18);
  }, [gmgReserves]);

  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

    Promise.allSettled([
      readJewelUsdcReserves(),
      readJewelGmJewelReserves(),
      readJewelGmgReserves()
    ])
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      readJewelUsdcReserves(),
      readJewelGmJewelReserves(),
      readJewelGmgReserves()
    ]).finally(() => setLoading(false));
  }, [])

  return [{ jewelPrice, gmJewelPriceInJewel, gmgPriceInJewel }, loading];
}
