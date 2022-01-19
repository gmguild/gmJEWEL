import { BigNumber, BigNumberish } from "ethers";
import { useMemo } from "react";
import { BigNumberToFloat } from "../../utils/conversion";

export const useFormattedBigNumber = (val?: BigNumberish, suffix = "") => useMemo(() => {
  return BigNumberToFloat(val as unknown as BigNumber || 0).toFixed(2) + suffix;
}, [val]);
