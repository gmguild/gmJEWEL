import { Interface } from "ethers/lib/utils";
import { useMemo } from "react";
import { Currency, CurrencyAmount, FACTORY_ADDRESS, Pair } from "../../package";
import { computePairAddress } from "../../package/functions";
import { useMultipleContractSingleData } from "../../state/multicall/hooks";
import IUniswapV2PairAbi from "../../constants/abi/UniswapPair.json";

const PAIR_INTERFACE = new Interface(IUniswapV2PairAbi.abi);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null][] {
  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        currencyA?.wrapped,
        currencyB?.wrapped,
      ]),
    [currencies]
  );

  const pairAddresses = useMemo(
    () =>
      tokens.reduce<(string | undefined)[]>((acc, [tokenA, tokenB]) => {
        const address =
          tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          FACTORY_ADDRESS[tokenA.chainId]
            ? computePairAddress({
                factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
                tokenA,
                tokenB,
              })
            : undefined;
        acc.push(address && !acc.includes(address) ? address : undefined);
        return acc;
      }, []),
    [tokens]
  );

  const results = useMultipleContractSingleData(
    pairAddresses,
    PAIR_INTERFACE,
    "getReserves"
  );

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];
      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB))
        return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
      ];
    });
  }, [results, tokens]);
}

export function usePair(
  tokenA?: Currency,
  tokenB?: Currency
): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(
    () => [[tokenA, tokenB]],
    [tokenA, tokenB]
  );
  return usePairs(inputs)[0];
}
