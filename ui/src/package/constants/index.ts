import { ChainId } from "../enums/ChainId";
import JSBI from "jsbi";

export * from "./numbers";
export * from "./addresses";
export * from "./tokens";
export * from "./natives";

export const INIT_CODE_HASH: { [chainId: number]: string } = {
  [ChainId.MAINNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.ROPSTEN]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.RINKEBY]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.GÖRLI]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.KOVAN]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.FANTOM]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.MATIC]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.MATIC_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.XDAI]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.BSC]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.BSC_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.ARBITRUM]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.MOONBEAM_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.AVALANCHE]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.AVALANCHE_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.HECO]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.HECO_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.HARMONY]:
    // DFK HASH
    "0xf1c21a825f13eff153022ddea53156462dd79972b6f88adf06f79ca8b042c3c1",
  [ChainId.HARMONY_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.OKEX]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.OKEX_TESTNET]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.CELO]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.PALM]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.MOONRIVER]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
  [ChainId.FUSE]:
    "0x1901958ef8b470f2c0a3875a79ee0bd303866d85102c0f1ea820d317024d50b5",
  [ChainId.TELOS]:
    "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303",
};

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);
