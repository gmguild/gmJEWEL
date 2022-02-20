import { JSBI, Percent } from "../package";

export const NetworkContextName = "NETWORK";
export const ZERO_PERCENT = new Percent("0");

export const ONE_HUNDRED_PERCENT = new Percent("1");
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  JSBI.BigInt(10000)
);

export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30;
