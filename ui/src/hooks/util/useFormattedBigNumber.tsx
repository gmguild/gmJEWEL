import { BigNumber, BigNumberish } from "ethers";
import { useMemo } from "react";
import { bigNumberToFloat } from "../../utils/conversion";

export const useFormattedBigNumber = (val?: BigNumberish, suffix = "") => useMemo(() => {
  return bigNumberToFloat(val as unknown as BigNumber || 0).toLocaleString() + suffix;
}, [val]);
