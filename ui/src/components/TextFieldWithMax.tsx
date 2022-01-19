import { utils } from "@usedapp/core/node_modules/ethers";
import { BigNumber } from "ethers";
import React, { SetStateAction } from "react";
import { BigNumberToFloat } from "../utils/conversion";

interface ITextFieldWithProps {
  maxValue: BigNumber;
  updateValue: React.Dispatch<SetStateAction<BigNumber>>;
}

export const TextFieldWithMax = (props: ITextFieldWithProps) => {
  const [value, setValue] = React.useState<string>("");

  const maxValueAsString = React.useMemo(() => {
    if (!props.maxValue) return "0";
    return BigNumberToFloat(props.maxValue).toFixed(5);
  }, [props.maxValue]);

  const updateText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (event.target.value) {
      props.updateValue(utils.parseEther(event.target.value));
    } else {
      props.updateValue(BigNumber.from(0));
    }
  };

  const setMax = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(maxValueAsString);
      props.updateValue(props.maxValue);
    },
    [value, maxValueAsString]
  );

  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <form autoComplete="off">
        <input
          type="number"
          id="deposit-0"
          name="deposit-0"
          value={value}
          onChange={updateText}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <input
            type="submit"
            value="Max"
            onClick={setMax}
            className="cursor-pointer border-rune-edge"
          />
        </div>
      </form>
    </div>
  );
};
