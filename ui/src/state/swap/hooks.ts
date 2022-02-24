/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ParsedQs } from "qs";
import { useCallback, useState, useEffect } from "react";
import { AppState } from "..";
import { tryParseAmount } from "../../functions/parse";
import { isAddress } from "../../functions/validate";
import {
  useV2TradeExactIn as useTradeExactIn,
  useV2TradeExactOut as useTradeExactOut,
} from "../../hooks/tavern/useTrades";
import { useCurrency } from "../../hooks/token/tokens";
import useParsedQueryString from "../../hooks/useParsedQueryString";
import useSwapSlippageTolerance from "../../hooks/useSwapSlippageTolerance";
import {
  Trade as V2Trade,
  Currency,
  CurrencyAmount,
  TradeType,
  Percent,
  ChainId,
  SUSHI_ADDRESS,
  WNATIVE_ADDRESS,
} from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useExpertModeManager, useUserSingleHopOnly } from "../user/hooks";
import { useCurrencyBalances } from "../wallet/hooks";
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";
import { SwapState } from "./reducer";

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

// TODO: Swtich for ours...
const BAD_RECIPIENT_ADDRESSES: {
  [chainId: string]: { [address: string]: true };
} = {
  [ChainId.MAINNET]: {
    "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac": true, // v2 factory
    "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F": true, // v2 router 02
  },
};

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

  // @ts-ignore
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

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === "string") {
    const valid = isAddress(urlParam);
    if (valid) return valid;
    if (urlParam.toUpperCase() === "ETH") return "ETH";
  }
  return "";
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === "string" && !isNaN(parseFloat(urlParam))
    ? urlParam
    : "";
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === "string" && urlParam.toLowerCase() === "output"
    ? Field.OUTPUT
    : Field.INPUT;
}
const ENS_NAME_REGEX =
  /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | undefined {
  if (typeof recipient !== "string") return undefined;
  const address = isAddress(recipient);
  if (address) return address;
  if (ENS_NAME_REGEX.test(recipient)) return recipient;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return undefined;
}

export function queryParametersToSwapState(
  parsedQs: ParsedQs,
  chainId: ChainId = ChainId.MAINNET
): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
  const eth = chainId === ChainId.CELO ? WNATIVE_ADDRESS[chainId] : "ETH";
  const sushi = SUSHI_ADDRESS[chainId];
  if (inputCurrency === "" && outputCurrency === "") {
    inputCurrency = eth;
    outputCurrency = sushi;
  } else if (inputCurrency === "") {
    inputCurrency = outputCurrency === eth ? sushi : eth;
  } else if (outputCurrency === "" || inputCurrency === outputCurrency) {
    outputCurrency = inputCurrency === eth ? sushi : eth;
  }

  const recipient = validatedRecipient(parsedQs.recipient);

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined;
      outputCurrencyId: string | undefined;
    }
  | undefined {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const parsedQs = useParsedQueryString();
  const [expertMode] = useExpertModeManager();
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined;
        outputCurrencyId: string | undefined;
      }
    | undefined
  >();

  useEffect(() => {
    if (!chainId) return;
    const parsed = queryParametersToSwapState(parsedQs, chainId);

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: expertMode ? parsed.recipient : undefined,
      })
    );

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId]);

  return result;
}
