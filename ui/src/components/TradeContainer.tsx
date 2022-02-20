import React, { useCallback, useMemo } from "react";
import { Field } from "../state/swap/actions";
import { useSwapActionHandlers, useSwapState } from "../state/swap/hooks";
import { Button } from "./Button";
import { SwapAsset } from "./SwapAsset";

export const TradeContainer = () => {
  const { onUserInput } = useSwapActionHandlers();
  const { independentField, typedValue } = useSwapState();
  const { parsedAmount, v2Trade } = useDerivedSwapInfo();

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  // TODO: find out what this is
  const showWrap = false;
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

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignficant(6) ?? "",
  };

  return (
    <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 rounded-[24px] bg-white">
      <div className="flex gap-4">
        <p>Swap</p>
        <p>Pool</p>
      </div>
      <div>
        <SwapAsset
          value={formattedAmounts[Field.INPUT]}
          onChange={handleTypeInput}
        />
        <SwapAsset onChange={() => {}} />
        <Button>Swap</Button>
      </div>
    </div>
  );
};