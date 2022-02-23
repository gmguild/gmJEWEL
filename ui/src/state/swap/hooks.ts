/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback } from "react";
import { AppState } from "..";
import { tryParseAmount } from "../../functions/parse";
import { isAddress } from "../../functions/validate";
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
  Percent,
} from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useUserSingleHopOnly } from "../user/hooks";
import { useCurrencyBalances } from "../wallet/hooks";
import {
  Field,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient?: string) => void;
} {
  const dispatch = useAppDispatch();

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken
            ? currency.address
            : currency.isNative
            ? "ETH"
            : "",
        })
      );
    },
    [dispatch]
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  const onChangeRecipient = useCallback(
    (recipient?: string) => {
      dispatch(setRecipient(recipient));
    },
    [dispatch]
  );

  return {
    onSwitchTokens,
    onChangeRecipient,
    onCurrencySelection,
    onUserInput,
  };
}

export function useSwapState(): AppState["swap"] {
  return useAppSelector((state) => state.swap);
}

function involvesAddress(
  trade: V2Trade<Currency, Currency, TradeType>,
  checksummedAddress: string
): boolean {
  const path = trade.route.path;
  return (
    path.some((token) => token.address === checksummedAddress) ||
    (trade instanceof V2Trade
      ? trade.route.pairs.some(
          (pair) => pair.liquidityToken.address === checksummedAddress
        )
      : false)
  );
}

export function useDerivedSwapInfo(): {
  to?: string;
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
  parsedAmount: CurrencyAmount<Currency> | undefined;
  inputError?: string;
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined;
  allowedSlippage: Percent;
} {
  const { account, chainId } = useActiveWeb3React();
  const [singleHopOnly] = useUserSingleHopOnly();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState();
  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  // const recipientLookup = useENS(recipient ?? undefined);

  //TODO: add ens
  const to = account ?? undefined;
  // (recipient === undefined ? account : recipientLookup.address) ?? undefined;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;

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
    {
      maxHops: singleHopOnly ? 1 : undefined,
    }
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;

  if (!account) {
    inputError = "Connect Wallet";
  }

  if (!parsedAmount) {
    inputError = inputError ?? `Enter an amount`;
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? `Select a token`;
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? `Enter a recipient`;
  } else {
    if (
      // @ts-ignore TYPE NEEDS FIXING
      BAD_RECIPIENT_ADDRESSES?.[chainId]?.[formattedTo] ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? `Invalid recipient`;
    }
  }

  // @ts-ignore TYPE NEEDS FIXING
  const allowedSlippage = useSwapSlippageTolerance(v2Trade);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    v2Trade?.maximumAmountIn(allowedSlippage),
  ];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = `Insufficient Balance`;
  }

  return {
    to,
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    v2Trade: v2Trade ?? undefined,
    allowedSlippage,
  };
}
