import { ethers } from "ethers";
import React, { useCallback, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { TradeContainer } from "../components/TradeContainer";

function useAddTokenToWallet(): [
  (tokenAddress: string, symbol: string, image?: string) => Promise<void>,
  boolean
] {
  const [loading, setLoading] = useState(false);
  const provider = useProvider() as ethers.providers.JsonRpcProvider;
  const [{ data: accountData }] = useAccount();

  const fn = useCallback(
    async (tokenAddress: string, symbol: string, _image?: string) => {
      if (loading) return;
      if (!accountData) return;

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
  return (
    <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
      <TradeContainer />
    </article>
  );
}
