import { ethers } from "ethers";
import React, { useCallback, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import Container from "../components/Container";
import Layout from "../layouts/Default";
import TradePage from "./TradePage";

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
    <Layout>
      <Container
        className="mx-auto font-lora py-4 md:py-8 lg:py-12"
        maxWidth="2xl"
      >
        <TradePage />
      </Container>
    </Layout>
  );
}
