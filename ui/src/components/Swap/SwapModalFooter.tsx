import React from "react";
import { FC, ReactNode } from "react";
import Button from "../Button";
import SwapCallbackError from "./SwapCallbackError";

interface SwapModalFooter {
  onConfirm: () => void;
  swapErrorMessage?: ReactNode;
  disabledConfirm: boolean;
}

const SwapModalFooter: FC<SwapModalFooter> = ({
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={onConfirm}
        disabled={disabledConfirm}
        id="confirm-swap-or-send"
        color="blue"
      >
        {`Confirm Swap`}
      </Button>

      {swapErrorMessage && <SwapCallbackError error={swapErrorMessage} />}
    </div>
  );
};

export default SwapModalFooter;
