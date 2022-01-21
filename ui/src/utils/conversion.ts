import { BigNumber, BigNumberish, utils } from "ethers";
import { getAddress } from "ethers/lib/utils";

export function bigNumberToFloat(n: BigNumber | string, decimals = 18) {
  if (typeof n === "string") {
    return parseFloat(utils.formatUnits(BigNumber.from(n), decimals));
  } else {
    return parseFloat(utils.formatUnits(n, decimals));
  }
}

export function bigNumberMax(...numbers: BigNumberish[]) {
  return numbers.map(n => BigNumber.from(n)).reduce((curMax, nextVal) => nextVal.gt(curMax) ? nextVal : curMax);
}

export function bigNumberMin(...numbers: BigNumberish[]) {
  return numbers.map(n => BigNumber.from(n)).reduce((curMin, nextVal) => nextVal.lt(curMin) ? nextVal : curMin);
}

export function toBytes32(str: string) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return "0x" + result.padStart(32, "0");
}

export function bignumberishWeiFormat(val?: BigNumberish) {
  if (!val) return;

  return utils.formatEther(BigNumber.from(val));
}

export function isAddress(value: string): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
