import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "../entities/connectors";
import { ChainId } from "../package";

import RPC from "./rpc";

const supportedChainIds = Object.values(ChainId) as number[];

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC,
});

export const injected = new InjectedConnector({
  supportedChainIds,
});

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconName: "injected.svg",
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  METAMASK_MOBILE: {
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Open in MetaMask app.",
    href: "https://metamask.app.link/dapp/app.sushi.com",
    color: "#E8831D",
    mobile: true,
    mobileOnly: true,
  },
  WALLET_CONNECT: {
    connector: async () => {
      const WalletConnectConnector = (
        await import("@web3-react/walletconnect-connector")
      ).WalletConnectConnector;
      return new WalletConnectConnector({
        rpc: RPC,
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        supportedChainIds,
      });
    },
    name: "WalletConnect",
    iconName: "wallet-connect.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
  LATTICE: {
    connector: async () => {
      const LatticeConnector = (await import("@web3-react/lattice-connector"))
        .LatticeConnector;
      return new LatticeConnector({
        chainId: 1,
        url: RPC[ChainId.MAINNET],
        appName: "SushiSwap",
      });
    },
    name: "Lattice",
    iconName: "lattice.png",
    description: "Connect to GridPlus Wallet.",
    href: null,
    color: "#40a9ff",
    mobile: true,
  },
  WALLET_LINK: {
    connector: async () => {
      const WalletLinkConnector = (
        await import("@web3-react/walletlink-connector")
      ).WalletLinkConnector;
      return new WalletLinkConnector({
        url: RPC[ChainId.MAINNET],
        appName: "SushiSwap",
        appLogoUrl:
          "https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png",
        darkMode: true,
      });
    },
    name: "Coinbase Wallet",
    iconName: "coinbase.svg",
    description: "Use Coinbase Wallet app on mobile device",
    href: null,
    color: "#315CF5",
  },
  COINBASE_LINK: {
    name: "Open in Coinbase Wallet",
    iconName: "coinbase.svg",
    description: "Open in Coinbase Wallet app.",
    href: "https://go.cb-w.com",
    color: "#315CF5",
    mobile: true,
    mobileOnly: true,
  },
};
