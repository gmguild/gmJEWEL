import React from "react";
import NumericInput from "./NumericInput";

interface SwapAsset {
  onChange(x?: string): void;
  value?: string;
}

const InputPanel: React.FC<Pick<SwapAsset, "onChange" | "value">> = ({
  onChange,
  value,
}) => {
  return (
    <div className="h3 relative flex items-baseline flex-grow gap-3 overflow-hidden">
      <NumericInput value={value || ""} onUserInput={onChange} />
    </div>
  );
};

export const SwapAsset = ({ onChange }: SwapAsset) => {
  return (
    <div className="rounded-[14px] border border-dark-700 hover:border-dark-600 bg-dark-900 p-3 flex flex-col gap-4">
      Header
      <div className="flex gap-1 justify-between items-baseline px-1.5">
        <InputPanel onChange={onChange} /> Balance
      </div>
    </div>
  );
};
