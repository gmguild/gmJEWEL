import React from "react";
import { FC } from "react";
import { ArrowDown } from "react-feather";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import { Currency, Percent, Trade, TradeType, ZERO } from "../../package";
import Button from "../Button";
import { CurrencyLogo } from "../CurrencyLogo";
import HeadlessUiModal from "../Modal/HeadlessUIModal";
import Typography from "../Typography";
import SwapDetails from "./SwapDetails";

interface SwapModalHeader {
  trade?: Trade<
    Currency,
    Currency,
    TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  >;
  allowedSlippage: Percent;
  recipient?: string;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}

const SwapModalHeader: FC<SwapModalHeader> = ({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}) => {
  const fiatValueInput = useUSDCValue(trade?.inputAmount);
  const fiatValueOutput = useUSDCValue(trade?.outputAmount);

  const change =
    ((Number(fiatValueOutput?.toExact()) - Number(fiatValueInput?.toExact())) /
      Number(fiatValueInput?.toExact())) *
    100;

  return (
    <div className="grid gap-2">
      <div className="flex flex-col">
        <HeadlessUiModal.BorderedContent className="bg-taupe-500/40 border !border-taupe-300 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography
                  variant="h3"
                  weight={700}
                  className="text-high-emphesis"
                >
                  {trade?.inputAmount.toSignificant(6)}{" "}
                </Typography>
                {fiatValueInput?.greaterThan(ZERO) && (
                  <Typography className="text-secondary">
                    ${fiatValueInput.toFixed(2)}
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={trade?.inputAmount.currency}
                size={18}
                className="!rounded-full overflow-hidden"
              />
              <Typography
                variant="lg"
                weight={700}
                className="text-high-emphesis"
              >
                {trade?.inputAmount.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
        <div className="flex justify-center -mt-3 -mb-3">
          <div className="border-2 border-taupe-300 shadow-md rounded-full p-1 backdrop-blur-[20px] z-10">
            <ArrowDown size={18} />
          </div>
        </div>
        <HeadlessUiModal.BorderedContent className="bg-taupe-500/40 border !border-taupe-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography
                  variant="h3"
                  weight={700}
                  className="text-high-emphesis"
                >
                  {trade?.outputAmount.toSignificant(6)}{" "}
                </Typography>
                {fiatValueOutput?.greaterThan(ZERO) && (
                  <Typography className="text-secondary">
                    ${fiatValueOutput?.toFixed(2)}{" "}
                    <Typography variant="xs" component="span">
                      ({change.toFixed(2)}%)
                    </Typography>
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={trade?.outputAmount.currency}
                size={18}
                className="!rounded-full overflow-hidden"
              />
              <Typography
                variant="lg"
                weight={700}
                className="text-high-emphesis"
              >
                {trade?.outputAmount.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
      <SwapDetails
        trade={trade}
        recipient={recipient}
        inputCurrency={trade?.inputAmount.currency}
        outputCurrency={trade?.outputAmount.currency}
        className="!border-taupe-300"
      />

      {showAcceptChanges && (
        <HeadlessUiModal.BorderedContent className="border !border-taupe-300">
          <div className="flex items-center justify-between">
            <Typography variant="sm" weight={700}>
              {`Price Updated`}
            </Typography>
            <Button
              variant="outlined"
              size="xs"
              color="blue"
              onClick={onAcceptChanges}
            >
              {`Accept`}
            </Button>
          </div>
        </HeadlessUiModal.BorderedContent>
      )}
      <div className="justify-start text-sm text-center text-secondary py-2">
        {trade?.tradeType === TradeType.EXACT_INPUT ? (
          <Typography variant="xs" className="text-secondary">
            {`Output is estimated. You will receive at least`}{" "}
            <Typography
              variant="xs"
              className="text-high-emphesis"
              weight={700}
              component="span"
            >
              {trade.minimumAmountOut(allowedSlippage).toSignificant(6)}{" "}
              {trade.outputAmount.currency.symbol}
            </Typography>{" "}
            {`or the transaction will revert.`}
          </Typography>
        ) : (
          <Typography variant="xs" className="text-secondary">
            {`Input is estimated. You will sell at most`}{" "}
            <Typography
              variant="xs"
              className="text-high-emphesis"
              weight={700}
              component="span"
            >
              {trade?.maximumAmountIn(allowedSlippage).toSignificant(6)}{" "}
              {trade?.inputAmount.currency.symbol}
            </Typography>{" "}
            {`or the transaction will revert.`}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default SwapModalHeader;
