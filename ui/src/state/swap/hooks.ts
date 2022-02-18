import { useCallback } from "react";
import { AppState } from "..";
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
};
