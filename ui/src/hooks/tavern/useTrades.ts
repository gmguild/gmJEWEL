import { useMemo } from "react";
import {
  Currency,
  CurrencyAmount,
  Pair,
  Trade,
  TradeType,
} from "../../package";
import { useAllCurrencyCombinations } from "./useAllCurrencyCombinations";

const MAX_HOPS = 2;

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const allCurrencyCombinations = useAllCurrencyCombinations(
    currencyA,
    currencyB
  );
  const allPairs = usePairs(allCurrencyCombinations);

  return useMemo(
    () =>
      Object.values(
        allPairs
          .filter((result): result is [PairState.EXISTS, Pair] =>
            Boolean(result[0] === PairState.EXISTS && result[1])
          )
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] =
              memo[curr.liquidityToken.address] ?? curr;
            return memo;
          }, {})
      ),
    [allPairs]
  );
}

export function useV2TradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
  { maxHops = MAX_HOPS } = {}
): Trade<Currency, Currency, TradeType.EXACT_INPUT> | null {
  const allowedPairs = useAllCommonPairs(
    currencyAmountIn?.currency,
    currencyOut
  );

  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      if (maxHops === 1) {
        return (
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
            maxHops: 1,
            maxNumResults: 1,
          })[0] ?? null
        );
      }
      let bestTradeSoFar: Trade<
        Currency,
        Currency,
        TradeType.EXACT_INPUT
      > | null = null;
      for (let i = 1; i <= maxHops; i++) {
        const currentTrade: Trade<
          Currency,
          Currency,
          TradeType.EXACT_INPUT
        > | null =
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
            maxHops: i,
            maxNumResults: 1,
          })[0] ?? null;
        if (
          isTradeBetter(
            bestTradeSoFar,
            currentTrade,
            BETTER_TRADE_LESS_HOPS_THRESHOLD
          )
        ) {
          bestTradeSoFar = currentTrade;
        }
      }
      return bestTradeSoFar;
    }

    return null;
  }, [allowedPairs, currencyAmountIn, currencyOut, maxHops]);
}

export function useV2TradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>,
  { maxHops = MAX_HOPS } = {}
): Trade<Currency, Currency, TradeType.EXACT_OUTPUT> | null {
  const allowedPairs = useAllCommonPairs(
    currencyIn,
    currencyAmountOut?.currency
  );

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      if (maxHops === 1) {
        return (
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
            maxHops: 1,
            maxNumResults: 1,
          })[0] ?? null
        );
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade<
        Currency,
        Currency,
        TradeType.EXACT_OUTPUT
      > | null = null;
      for (let i = 1; i <= maxHops; i++) {
        const currentTrade =
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
            maxHops: i,
            maxNumResults: 1,
          })[0] ?? null;
        if (
          isTradeBetter(
            bestTradeSoFar,
            currentTrade,
            BETTER_TRADE_LESS_HOPS_THRESHOLD
          )
        ) {
          bestTradeSoFar = currentTrade;
        }
      }
      return bestTradeSoFar;
    }
    return null;
  }, [currencyIn, currencyAmountOut, allowedPairs, maxHops]);
}
