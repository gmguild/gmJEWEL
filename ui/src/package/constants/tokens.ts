import { WNATIVE_ADDRESS } from ".";
import { ChainId, Token } from "..";
import { TokenMap } from "../types/TokenMap";

export const WNATIVE: TokenMap = {
  [ChainId.HARMONY]: new Token(
    ChainId.HARMONY,
    WNATIVE_ADDRESS[ChainId.HARMONY],
    18,
    "WONE",
    "Wrapped ONE"
  ),
};
