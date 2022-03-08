/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { FunctionComponent, useMemo } from "react";
import useHttpLocations from "../../hooks/useHttpLocations";
import { ChainId, Currency, WNATIVE } from "../../package";
import { WrappedTokenInfo } from "../../state/lists/wrappedTokenInfo";
import Logo, { UNKNOWN_ICON } from "../Logo";

const BLOCKCHAIN = {
  [ChainId.MAINNET]: "ethereum",
  [ChainId.BSC]: "binance",
  [ChainId.CELO]: "celo",
  [ChainId.FANTOM]: "fantom",
  [ChainId.AVALANCHE_TESTNET]: "fuji",
  [ChainId.FUSE]: "fuse",
  [ChainId.HARMONY]: "harmony",
  [ChainId.HECO]: "heco",
  [ChainId.MATIC]: "matic",
  [ChainId.MOONRIVER]: "moonriver",
  [ChainId.OKEX]: "okex",
  [ChainId.PALM]: "palm",
  [ChainId.TELOS]: "telos",
  [ChainId.XDAI]: "xdai",
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.AVALANCHE]: "avalanche",
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TYPE NEEDS FIXING
export const getCurrencyLogoUrls = (currency): string[] => {
  const urls: string[] = [];

  if (currency.chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/gmguild/gmJEWEL/dev/ui/src/assets/${
        // @ts-ignore
        BLOCKCHAIN[currency.chainId]
      }/${currency.address}.png`
    );
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/logos/main/network/${
        // @ts-ignore
        BLOCKCHAIN[currency.chainId]
      }/${currency.address}.jpg`
    );
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${
        // @ts-ignore
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`
    );
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
        // @ts-ignore
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`
    );
  }
  return urls;
};

const AvalancheLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/avax.jpg";
const BinanceCoinLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/bnb.jpg";
const EthereumLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/eth.jpg";
const FantomLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/ftm.jpg";
const HarmonyLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/one.jpg";
const HecoLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/heco.jpg";
const MaticLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/polygon.jpg";
const MoonbeamLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/eth.jpg";
const OKExLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/okt.jpg";
const xDaiLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/xdai.jpg";
const CeloLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/celo.jpg";
const PalmLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/palm.jpg";
const MovrLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/movr.jpg";
const FuseLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/fuse.jpg";
const TelosLogo =
  "https://raw.githubusercontent.com/sushiswap/logos/main/token/telos.jpg";

const LOGO: Record<ChainId, string> = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.KOVAN]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.ROPSTEN]: EthereumLogo,
  [ChainId.GÖRLI]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MATIC_TESTNET]: MaticLogo,
  [ChainId.XDAI]: xDaiLogo,
  [ChainId.BSC]: BinanceCoinLogo,
  [ChainId.BSC_TESTNET]: BinanceCoinLogo,
  [ChainId.MOONBEAM_TESTNET]: MoonbeamLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.AVALANCHE_TESTNET]: AvalancheLogo,
  [ChainId.HECO]: HecoLogo,
  [ChainId.HECO_TESTNET]: HecoLogo,
  [ChainId.HARMONY]: HarmonyLogo,
  [ChainId.HARMONY_TESTNET]: HarmonyLogo,
  [ChainId.OKEX]: OKExLogo,
  [ChainId.OKEX_TESTNET]: OKExLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
  [ChainId.PALM]: PalmLogo,
  [ChainId.PALM_TESTNET]: PalmLogo,
  [ChainId.MOONRIVER]: MovrLogo,
  [ChainId.FUSE]: FuseLogo,
  [ChainId.TELOS]: TelosLogo,
};

export interface CurrencyLogoProps {
  currency?: Currency;
  size?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
  currency,
  size = "24px",
  className,
  style,
}) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo
      ? currency.logoURI || currency.tokenInfo.logoURI
      : undefined
  );

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative || currency?.equals(WNATIVE[currency.chainId])) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TYPE NEEDS FIXING
      return [LOGO[currency.chainId], UNKNOWN_ICON];
    }

    if (currency?.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)];
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, UNKNOWN_ICON];
      }
      return defaultUrls;
    }

    return [UNKNOWN_ICON];
  }, [currency, uriLocations]);

  return (
    <Logo
      srcs={srcs}
      width={size}
      height={size}
      alt={currency?.symbol}
      className={className}
      style={style}
    />
  );
};

export default CurrencyLogo;
