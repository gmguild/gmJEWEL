import { Token } from "../entities";
import { ChainId } from "../enums";
import { TokenMap } from "../types/TokenMap";
import { USDC_ADDRESS, USD_ADDRESS, WNATIVE_ADDRESS } from "./addresses";

export const WNATIVE: TokenMap = {};

export const USDC: TokenMap = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    USDC_ADDRESS[ChainId.MAINNET],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    USDC_ADDRESS[ChainId.ROPSTEN],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.KOVAN]: new Token(
    ChainId.KOVAN,
    USDC_ADDRESS[ChainId.KOVAN],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    USDC_ADDRESS[ChainId.MATIC],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.FANTOM]: new Token(
    ChainId.FANTOM,
    USDC_ADDRESS[ChainId.FANTOM],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.BSC]: new Token(
    ChainId.BSC,
    USDC_ADDRESS[ChainId.BSC],
    18,
    "USDC",
    "USD Coin"
  ),
  [ChainId.HARMONY]: new Token(
    ChainId.HARMONY,
    USDC_ADDRESS[ChainId.HARMONY],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.HECO]: new Token(
    ChainId.HECO,
    USDC_ADDRESS[ChainId.HECO],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.OKEX]: new Token(
    ChainId.OKEX,
    USDC_ADDRESS[ChainId.OKEX],
    18,
    "USDC",
    "USD Coin"
  ),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    USDC_ADDRESS[ChainId.XDAI],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    USDC_ADDRESS[ChainId.ARBITRUM],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.MOONRIVER]: new Token(
    ChainId.MOONRIVER,
    USDC_ADDRESS[ChainId.MOONRIVER],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    USDC_ADDRESS[ChainId.AVALANCHE],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.FUSE]: new Token(
    ChainId.FUSE,
    USDC_ADDRESS[ChainId.FUSE],
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.TELOS]: new Token(
    ChainId.TELOS,
    USDC_ADDRESS[ChainId.TELOS],
    6,
    "USDC",
    "USD Coin"
  ),
};

export const USD: TokenMap = {
  ...USDC,
  [ChainId.CELO]: new Token(
    ChainId.CELO,
    USD_ADDRESS[ChainId.CELO],
    18,
    "cUSD",
    "Celo Dollar"
  ),
};
