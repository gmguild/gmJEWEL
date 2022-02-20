import { Harmony } from "../entities/Native/Harmony";
import { ChainId } from "../enums";
import { NativeMap } from "../types/NativeMap";

export const NATIVE: NativeMap = {
  [ChainId.HARMONY]: Harmony.onChain(ChainId.HARMONY),
  [ChainId.HARMONY_TESTNET]: Harmony.onChain(ChainId.HARMONY_TESTNET),
};
