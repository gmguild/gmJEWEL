import { ExclamationIcon } from "@heroicons/react/outline";
import React from "react";
import { FC, useState } from "react";
import { DEFAULT_DEADLINE_FROM_NOW } from "../../constants";
import { Percent } from "../../package";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
  formatSlippageInput,
  GLOBAL_DEFAULT_SLIPPAGE_PERCENT,
  GLOBAL_DEFAULT_SLIPPAGE_STR,
  setSlippageInput,
  SlippageError,
  slippageSelectors,
} from "../../state/slippage/slippageSlice";
import { useUserTransactionTTL } from "../../state/user/hooks";
import { classNames } from "../../utils/classNames";
import Button from "../Button";
import QuestionHelper from "../QuestionHelper";
import Typography from "../Typography";

enum DeadlineError {
  InvalidInput = "InvalidInput",
}

export interface TransactionSettingsProps {
  placeholderSlippage?: Percent; // varies according to the context in which the settings dialog is placed
  trident?: boolean;
}

const TransactionSettings: FC<TransactionSettingsProps> = ({
  placeholderSlippage,
  trident = false,
}) => {
  const dispatch = useAppDispatch();

  const {
    error: slippageError,
    percent: slippagePercent,
    input: slippageInput,
  } = useAppSelector(slippageSelectors);
  const slippageIsDefault = slippagePercent.equalTo(
    GLOBAL_DEFAULT_SLIPPAGE_PERCENT
  );

  const [deadline, setDeadline] = useUserTransactionTTL();
  const [deadlineInput, setDeadlineInput] = useState("");
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(
    false
  );

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value);
    setDeadlineError(false);

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW);
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60);
        if (
          !Number.isInteger(parsed) ||
          parsed < 60 ||
          parsed >= Number.MAX_SAFE_INTEGER
        ) {
          setDeadlineError(DeadlineError.InvalidInput);
        } else {
          setDeadline(parsed);
        }
      } catch (error) {
        console.error(error);
        setDeadlineError(DeadlineError.InvalidInput);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <div className="flex items-center">
          <Typography variant="xs" weight={700} className="text-high-emphesis">
            {`Slippage tolerance`}
          </Typography>

          <QuestionHelper
            text={`Your transaction will revert if the price changes unfavorably by more than this percentage.`}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={classNames(
              slippageError === SlippageError.INVALID_INPUT
                ? "border-red/60"
                : slippageError === SlippageError.TOO_LOW ||
                  slippageError === SlippageError.TOO_HIGH
                ? "border-yellow/60"
                : !slippageIsDefault
                ? "border-blue"
                : "border-taupe-300",
              "border-2 h-[36px] flex items-center px-2 rounded bg-taupe-500/40"
            )}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between gap-1">
              {slippageError === SlippageError.TOO_LOW ||
              slippageError === SlippageError.TOO_HIGH ? (
                <ExclamationIcon className="text-yellow" width={24} />
              ) : null}
              <input
                id="text-slippage"
                className={classNames(
                  slippageError === SlippageError.INVALID_INPUT
                    ? "text-red"
                    : "",
                  "bg-transparent placeholder-low-emphesis min-w-0 w-full font-bold"
                )}
                placeholder={placeholderSlippage?.toFixed(2)}
                value={slippageInput}
                onChange={(e) => dispatch(setSlippageInput(e.target.value))}
                onBlur={() =>
                  slippageError === SlippageError.INVALID_INPUT
                    ? dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))
                    : dispatch(formatSlippageInput())
                }
                color={
                  slippageError === SlippageError.INVALID_INPUT ? "red" : ""
                }
                autoComplete="off"
              />
              %
            </div>
          </div>
          <div>
            <Button
              size="sm"
              color={slippageIsDefault ? "blue" : "gray"}
              variant="outlined"
              onClick={() =>
                dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))
              }
            >
              {`Auto`}
            </Button>
          </div>
        </div>
        {slippageError ? (
          <Typography
            className={classNames(
              slippageError === SlippageError.INVALID_INPUT
                ? "text-red"
                : "text-yellow",
              "font-medium flex items-center space-x-2"
            )}
            variant="xs"
            weight={700}
          >
            <div>
              {slippageError === SlippageError.INVALID_INPUT
                ? `Enter a valid slippage percentage`
                : slippageError === SlippageError.TOO_HIGH
                ? `Your transaction may be frontrun`
                : `Your transaction may fail`}
            </div>
          </Typography>
        ) : null}
      </div>

      {!trident && (
        <div className="grid gap-2">
          <div className="flex items-center">
            <Typography
              variant="xs"
              weight={700}
              className="text-high-emphesis"
            >
              {`Transaction deadline`}
            </Typography>

            <QuestionHelper
              text={`Your transaction will revert if it is pending for more than this long.`}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              className={classNames(
                deadlineError ? "text-red" : "",
                "font-bold bg-transparent placeholder-low-emphesis bg-taupe-500/40 border-2 border-taupe-300 rounded px-3 py-2 max-w-[100px] focus:border-blue"
              )}
              placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
              value={
                deadlineInput.length > 0
                  ? deadlineInput
                  : deadline === DEFAULT_DEADLINE_FROM_NOW
                  ? ""
                  : (deadline / 60).toString()
              }
              onChange={(e) => parseCustomDeadline(e.target.value)}
              onBlur={() => {
                setDeadlineInput("");
                setDeadlineError(false);
              }}
              color={deadlineError ? "red" : ""}
            />
            <Typography variant="sm" weight={700} className="text-secondary">
              {`minutes`}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionSettings;
