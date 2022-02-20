import { ChainId, Token, WNATIVE } from "../package";

import * as HARMONY from "./tokens/harmony";

type ChainTokenList = {
  readonly [chainId: number]: Token[];
};

const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.HARMONY]: [WNATIVE[ChainId.HARMONY]],
};

export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.HARMONY]: [...WRAPPED_NATIVE_ONLY[ChainId.HARMONY], HARMONY.GMG],
};

export const ADDITIONAL_BASES: {
  [chanId: number]: { [tokenAddress: string]: Token[] };
} = {};

export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] };
} = {};

export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.HARMONY]: [...WRAPPED_NATIVE_ONLY[ChainId.HARMONY], HARMONY.GMG],
};

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][];
} = {};
