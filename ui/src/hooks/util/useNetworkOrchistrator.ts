import Cookies from "js-cookie";
import { useEffect } from "react";
import { ChainSubdomain } from "../../enums/ChainSubdomain";
import { SUPPORTED_NETWORKS } from "../../modals/NetworkModal";
import { ChainId } from "../../package";
import { useActiveWeb3React } from "../../services/web3";

const CHAIN_ID_SUBDOMAIN: { [chainId: number]: string } = {
  [ChainId.AVALANCHE]: ChainSubdomain.AVALANCHE,
  [ChainId.HECO]: ChainSubdomain.HECO,
  [ChainId.HARMONY]: ChainSubdomain.HARMONY,
  [ChainId.OKEX]: ChainSubdomain.OKEX,
  [ChainId.CELO]: ChainSubdomain.CELO,
  [ChainId.PALM]: ChainSubdomain.PALM,
  [ChainId.MOONRIVER]: ChainSubdomain.MOONRIVER,
  [ChainId.FUSE]: ChainSubdomain.FUSE,
  [ChainId.TELOS]: ChainSubdomain.TELOS,
};

function useNetworkOrchistrator() {
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on) {
      const handleChainChanged = (chainIdHex: string) => {
        const chainId = Number(chainIdHex);
        const chainIdFromCookie = Number(Cookies.get("chain-id"));
        // If chainId does not equal chainIdFromCookie, and we have a chain id subdomain mapping, replace location...
        if (chainId !== chainIdFromCookie && chainId in CHAIN_ID_SUBDOMAIN) {
          // Remove the cookie to prevent wallet prompt from running while location is reassigned
          Cookies.remove("chain-id");
          // window.location.assign(
          //   window.location.href.replace(
          //     /(:\/\/\w+\.)/,
          //     `://${CHAIN_ID_SUBDOMAIN[chainId]}.`
          //   )
          // );
        }
      };
      ethereum.on("chainChanged", handleChainChanged);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  const { chainId, library, account, active } = useActiveWeb3React();
  useEffect(() => {
    const chainIdFromCookie = Number(Cookies.get("chain-id"));

    if (
      !chainId ||
      !chainIdFromCookie ||
      !account ||
      chainId === chainIdFromCookie
    ) {
      return;
    }

    const promptWalletSwitch = async () => {
      const params = SUPPORTED_NETWORKS[chainIdFromCookie];
      try {
        await library?.send("wallet_switchEthereumChain", [
          { chainId: `0x${chainIdFromCookie.toString(16)}` },
          account,
        ]);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        //eslint-disable-next-line
        // @ts-ignore TYPE NEEDS FIXING
        if (switchError.code === 4902) {
          try {
            await library?.send("wallet_addEthereumChain", [params, account]);
          } catch (addError) {
            // handle "add" error
            console.error(`Add chain error ${addError}`);
          }
        }
        console.error(`Switch chain error ${switchError}`);
        // handle other "switch" errors
      }
    };
    promptWalletSwitch();
  }, [account, chainId, library]);
}

export default useNetworkOrchistrator;
