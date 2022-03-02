import { ChainId, Token, WNATIVE } from "../package";

import * as HARMONY from "./tokens/harmony";

type ChainTokenList = {
  readonly [chainId: number]: Token[];
};

const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.HARMONY]: [WNATIVE[ChainId.HARMONY]],
};

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.HARMONY]: [...WRAPPED_NATIVE_ONLY[ChainId.HARMONY], HARMONY.GMG],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  // ...WRAPPED_NATIVE_ONLY,
  [ChainId.HARMONY]: [...WRAPPED_NATIVE_ONLY[ChainId.HARMONY], HARMONY.GMG],
};

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] };
} = {};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] };
} = {};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.HARMONY]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    HARMONY.GMG,
    HARMONY.GMJEWEL,
  ],
};

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][];
} = {};
