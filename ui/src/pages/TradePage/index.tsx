/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ArrowDownIcon } from "@heroicons/react/outline";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import SwapAssetPanel from "../../components/Swap/SwapAssetPanel";
import Typography from "../../components/Typography";
import confirmPriceImpactWithoutFee, {
  warningSeverity,
} from "../../functions/prices";
import { computeFiatValuePriceImpact } from "../../functions/trade";
import { useAllTokens, useCurrency } from "../../hooks/token/tokens";
import { ApprovalState } from "../../hooks/useApproveCallback";
import useENSAddress from "../../hooks/useENSAddress";
import { useSwapCallback } from "../../hooks/useSwapCallback";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import useWrapCallback, { WrapType } from "../../hooks/useWrapCallback";
import {
  Trade as V2Trade,
  Currency,
  Token,
  TradeType,
  JSBI,
} from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { Field, setRecipient } from "../../state/swap/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/swap/hooks";
import {
  useExpertModeManager,
  useUserSingleHopOnly,
} from "../../state/user/hooks";

const TradePage = () => {
  const loadedUrlParams = useDefaultsFromURLSearch();
  const { account } = useActiveWeb3React();
  const defaultTokens = useAllTokens();
  const [isExpertMode] = useExpertModeManager();
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    allowedSlippage,
    to,
  } = useDerivedSwapInfo();
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];

  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c?.isToken ?? false
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens);
    });

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);

  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT
                ? parsedAmount
                : trade?.inputAmount,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT
                ? parsedAmount
                : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  );

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT]);
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT]);
  const priceImpact = computeFiatValuePriceImpact(
    fiatValueInput,
    fiatValueOutput
  );
  const { onSwitchTokens, onCurrencySelection, onUserInput } =
    useSwapActionHandlers();

  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );

  const routeNotFound = !trade?.route;

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage
  );

  const signatureData = undefined;

  const handleApprove = useCallback(async () => {
    await approveCallback();
    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== USER_REJECTED_TRANSACTION) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback]);
  // }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    to,
    signatureData,
    null
  );

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ]);

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    );
  }, [priceImpact, trade]);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const swapIsUnsupported = useIsSwapUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  );

  const priceImpactCss = useMemo(() => {
    switch (priceImpactSeverity) {
      case 0:
      case 1:
      case 2:
      default:
        return "text-low-emphesis";
      case 3:
        return "text-yellow";
      case 4:
        return "text-red";
    }
  }, [priceImpactSeverity]);

  return (
    <>
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        // @ts-ignore TYPE NEEDS FIXING
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />

      <SwapLayoutCard>
        <div className="px-2">
          <HeaderNew
            inputCurrency={currencies[Field.INPUT]}
            outputCurrency={currencies[Field.OUTPUT]}
          />
        </div>
        <div className="flex flex-col gap-3">
          <SwapAssetPanel
            spendFromWallet={true}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={
                  independentField === Field.OUTPUT && !showWrap
                    ? `Swap from (est.):`
                    : `Swap from:`
                }
              />
            )}
            currency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.INPUT]}
            onChange={handleTypeInput}
            onSelect={handleInputSelect}
          />
          <div className="flex justify-center -mt-6 -mb-6 z-0">
            <div
              role="button"
              className="p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-dark-600"
              onClick={() => {
                setApprovalSubmitted(false); // reset 2 step UI for approvals
                onSwitchTokens();
              }}
            >
              <ArrowDownIcon
                width={14}
                className="text-high-emphesis hover:text-white"
              />
            </div>
          </div>
          <SwapAssetPanel
            spendFromWallet={true}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={
                  independentField === Field.INPUT && !showWrap
                    ? `Swap to (est.):`
                    : `Swap to:`
                }
              />
            )}
            currency={currencies[Field.OUTPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onChange={handleTypeOutput}
            onSelect={handleOutputSelect}
            priceImpact={priceImpact}
            priceImpactCss={priceImpactCss}
          />
          {isExpertMode && (
            <RecipientField recipient={recipient} action={setRecipient} />
          )}
          {Boolean(trade) && (
            <SwapDetails
              inputCurrency={currencies[Field.INPUT]}
              outputCurrency={currencies[Field.OUTPUT]}
              trade={trade}
              recipient={recipient ?? undefined}
            />
          )}

          {trade && routeNotFound && userHasSpecifiedInputOutput && (
            <Typography variant="xs" className="text-center py-2">
              {`Insufficient liquidity for this trade.`}{" "}
              {singleHopOnly && `Try enabling multi-hop trades`}
            </Typography>
          )}

          {swapIsUnsupported ? (
            <Button
              color="red"
              disabled
              fullWidth
              className="rounded-2xl md:rounded"
            >
              {`Unsupported Asset`}
            </Button>
          ) : !account ? (
            <Web3Connect
              color="blue"
              variant="filled"
              fullWidth
              className="rounded-2xl md:rounded"
            />
          ) : showWrap ? (
            <Button
              fullWidth
              color="blue"
              disabled={Boolean(wrapInputError)}
              onClick={onWrap}
              className="rounded-2xl md:rounded"
            >
              {wrapInputError ??
                (wrapType === WrapType.WRAP
                  ? `Wrap`
                  : wrapType === WrapType.UNWRAP
                  ? `Unwrap`
                  : null)}
            </Button>
          ) : showApproveFlow ? (
            <div>
              {approvalState !== ApprovalState.APPROVED && (
                <Button
                  fullWidth
                  loading={approvalState === ApprovalState.PENDING}
                  onClick={handleApprove}
                  disabled={
                    approvalState !== ApprovalState.NOT_APPROVED ||
                    approvalSubmitted
                  }
                  className="rounded-2xl md:rounded"
                >
                  {`Approve ${currencies[Field.INPUT]?.symbol}`}
                </Button>
              )}
              {approvalState === ApprovalState.APPROVED && (
                <Button
                  color={
                    isValid && priceImpactSeverity > 2 ? "red" : "gradient"
                  }
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  fullWidth
                  id="swap-button"
                  disabled={
                    !isValid ||
                    approvalState !== ApprovalState.APPROVED ||
                    (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  className="rounded-2xl md:rounded"
                >
                  {priceImpactSeverity > 3 && !isExpertMode
                    ? `Price Impact High`
                    : priceImpactSeverity > 2
                    ? `Swap Anyway`
                    : `Swap`}
                </Button>
              )}
            </div>
          ) : (
            <Button
              color={
                isValid && priceImpactSeverity > 2 && !swapCallbackError
                  ? "red"
                  : "gradient"
              }
              fullWidth
              onClick={() => {
                if (isExpertMode) {
                  handleSwap();
                } else {
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined,
                  });
                }
              }}
              id="swap-button"
              disabled={
                !isValid ||
                (priceImpactSeverity > 3 && !isExpertMode) ||
                !!swapCallbackError
              }
              className="rounded-2xl md:rounded"
            >
              {swapInputError
                ? swapInputError
                : priceImpactSeverity > 3 && !isExpertMode
                ? `Price Impact Too High`
                : priceImpactSeverity > 2
                ? `Swap Anyway`
                : `Swap`}
            </Button>
          )}
          {isExpertMode && swapErrorMessage ? (
            <SwapCallbackError error={swapErrorMessage} />
          ) : null}
          {swapIsUnsupported ? (
            <UnsupportedCurrencyFooter
              currencies={[currencies.INPUT, currencies.OUTPUT]}
            />
          ) : null}
        </div>
      </SwapLayoutCard>
    </>
  );
};

export default TradePage;
