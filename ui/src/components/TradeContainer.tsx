import React, { useCallback } from "react";
import { Button } from "./Button";
import { SwapAsset } from "./SwapAsset";

export const TradeContainer = () => {
  const { onUserInput } = useSwapActionHandlers();

  const handleTypeInput = useCallback((value: string) => {
    onUserInput(Field.INPUT, value), [onUserInput];
  });

  return (
    <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 rounded-[24px] bg-white">
      <div className="flex gap-4">
        <p>Swap</p>
        <p>Pool</p>
      </div>
      <div>
        <SwapAsset onChange={() => {}} />
        <SwapAsset onChange={() => {}} />
        <Button>Swap</Button>
      </div>
    </div>
  );
};
