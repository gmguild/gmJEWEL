import { Token } from "../entities";
import { ChainId } from "../enums";

export type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token;
};
