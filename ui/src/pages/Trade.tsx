import { ethers } from "ethers";
import React, { useCallback, useState } from "react";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { Button } from "../components/Button";
import { classNames } from "../utils/classNames";
import { addresses } from "../utils/env";
import DFKJewel from "../assets/DFKJewel.png";
import DFKLockedJewel from "../assets/DFKLockedJewel.png";
import SmallGMG from "../assets/SmallGMG.png";

function useAddTokenToWallet(): [
  (tokenAddress: string, symbol: string, image?: string) => Promise<void>,
  boolean
] {
  const [loading, setLoading] = useState(false);
  const provider = useProvider() as ethers.providers.JsonRpcProvider;

  const fn = useCallback(
    async (tokenAddress: string, symbol: string, _image?: string) => {
      if (loading) return;

      try {
        setLoading(true);

        if (typeof window.ethereum !== "undefined") {
          console.debug("MetaMask is installed!");
        } else {
          throw new Error("window.ethereum was falsy");
        }

        const image = _image ? `${window.location.origin}${_image}` : undefined;
        const added = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: symbol,
              decimals: 18,
              image,
            },
          },
        });

        console.debug(`Did add token ${tokenAddress} ${symbol}?`, added, image);
      } catch (err) {
        console.error(err); // todo: error toast
      } finally {
        setLoading(false);
      }
    },
    [provider]
  );

  return [fn, loading];
}

export default function Trade() {
  const [{ data: accountData }] = useAccount();

  const [addTokenToWallet, addingTokenToWallet] = useAddTokenToWallet();

  const [{ data: accountNetwork }, switchNetwork] = useNetwork();

  const validChainConnected = React.useMemo(() => {
    if (!accountData?.address) return false;
    if (!accountNetwork.chain) return false;
    return !accountNetwork.chain.unsupported ?? false;
  }, [accountData?.address, accountNetwork.chain]);

  return (
    <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
      {validChainConnected ? (
        <>
          <p>
            Please go to the marketplace on{" "}
            <a
              href="https://game.defikingdoms.com/#/marketplace"
              target="_blank"
              rel="noreferrer"
            >
              DefiKingdoms
            </a>
          </p>
          <p>These are the token addresses:</p>
          <div className="w-full mx-auto">
            <table className={classNames("min-w-full table-auto")}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="flex flex-col items-enter">
                    JEWEL
                    <Button
                      className="text-xs p-1 mr-auto"
                      onClick={() =>
                        addTokenToWallet(
                          addresses.JewelToken,
                          "JEWEL",
                          DFKJewel
                        )
                      }
                      disabled={addingTokenToWallet}
                    >
                      Add to Wallet
                    </Button>
                  </td>
                  <td className="my-auto">{addresses.JewelToken}</td>
                </tr>
                <tr>
                  <td className="flex flex-col items-enter">
                    gmJEWEL
                    <Button
                      className="text-xs p-1 mr-auto"
                      onClick={() =>
                        addTokenToWallet(
                          addresses.gmJEWEL,
                          "gmJEWEL",
                          DFKLockedJewel
                        )
                      }
                      disabled={addingTokenToWallet}
                    >
                      Add to Wallet
                    </Button>
                  </td>
                  <td className="my-auto">{addresses.gmJEWEL}</td>
                </tr>
                <tr>
                  <td className="flex flex-col items-enter">
                    GMG
                    <Button
                      className="text-xs p-1 mr-auto"
                      onClick={() =>
                        addTokenToWallet(addresses.GMGToken, "GMG", SmallGMG)
                      }
                      disabled={addingTokenToWallet}
                    >
                      Add to Wallet
                    </Button>
                  </td>
                  <td className="my-auto">{addresses.GMGToken}</td>
                </tr>
                <tr>
                  <td className="flex flex-col items-enter">
                    xGMG
                    <Button
                      className="text-xs p-1 mr-auto"
                      onClick={() =>
                        addTokenToWallet(addresses.xGMG, "xGMG", SmallGMG)
                      }
                      disabled={addingTokenToWallet}
                    >
                      Add to Wallet
                    </Button>
                  </td>
                  <td className="my-auto">{addresses.xGMG}</td>
                </tr>
                <tr>
                  <td className="flex flex-col items-enter">
                    JEWEL-gmJEWEL LP Token
                    <Button
                      className="text-xs p-1 mr-auto"
                      onClick={() =>
                        addTokenToWallet(addresses.JgmJLPToken, "JEWEL-LP")
                      }
                      disabled={addingTokenToWallet}
                    >
                      Add to Wallet
                    </Button>
                  </td>
                  <td className="my-auto">{addresses.JgmJLPToken}</td>
                </tr>
                <tr>
                  <td className="flex flex-col items-enter">
                    JEWEL-GMG LP Token
                    <Button
                      className="text-xs p-1 mr-auto"
                      onClick={() =>
                        addTokenToWallet(addresses.JGMGLPToken, "JEWEL-LP")
                      }
                      disabled={addingTokenToWallet}
                    >
                      Add to Wallet
                    </Button>
                  </td>
                  <td className="my-auto">{addresses.JGMGLPToken}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
          {accountData?.address == undefined && (
            <p>Please connect your wallet in order to trade</p>
          )}
          {accountNetwork.chain?.unsupported && switchNetwork && (
            <p>
              Please change your network to{" "}
              <a href="#" onClick={() => switchNetwork(1666600000)}>
                harmony
              </a>
            </p>
          )}
        </article>
      )}
    </article>
  );
}
