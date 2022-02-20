import { useCallback } from "react";
import { AppState } from "..";
import { tryParseAmount } from "../../functions/parse";
import {
  useV2TradeExactIn as useTradeExactIn,
  useV2TradeExactOut as useTradeExactOut,
} from "../../hooks/tavern/useTrades";
import { useCurrency } from "../../hooks/token/tokens";
import {
  Trade as V2Trade,
  Currency,
  CurrencyAmount,
  TradeType,
} from "../../package";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Field, typeInput } from "./actions";

export function useSwapActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void;
} {
  const dispatch = useAppDispatch();

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  return { onUserInput };
}

export function useSwapState(): AppState["swap"] {
  return useAppSelector((state) => state.swap);
}

export function useDerivedSwapInfo(): {
  parsedAmount: CurrencyAmount<Currency> | undefined;
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined;
} {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const isExactIn: boolean = independentField === Field.INPUT;

  const singleHopOnly = true;

  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined,
    {
      maxHops: singleHopOnly ? 1 : undefined,
    }
  );

  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined,
    { maxHops: singleHopOnly ? 1 : undefined }
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  return {
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
  };
}
