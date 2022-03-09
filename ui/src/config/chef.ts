import { ChainId, Token } from "../package";
import { addresses } from "../utils/env";

type MasterJewelerFarmList = {
  readonly [chainId: number]: Token[];
};

export const MasterJewelerFarms: MasterJewelerFarmList = {
  [ChainId.HARMONY]: [
    new Token(
      ChainId.HARMONY,
      addresses.JgmJLPToken,
      18,
      "JEWEL-LP",
      "Jewel LP Token"
    ),
    new Token(
      ChainId.HARMONY,
      addresses.JGMGLPToken,
      18,
      "JEWEL-LP",
      "Jewel LP Token"
    ),
  ],
};
