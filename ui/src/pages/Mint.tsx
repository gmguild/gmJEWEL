import React from "react";
import { useAccount } from "wagmi";
import { CreateUTXO } from "../components/CreateUTXO";
import { useNetwork } from "wagmi";

export default function Home() {
  const [{ data: accountData }] = useAccount();
  const [{ data: accountNetwork }, switchNetwork] = useNetwork();

  const validChainConnected = React.useMemo(() => {
    if (!accountData?.address) return false;
    if (!accountNetwork.chain) return false;
    return !accountNetwork.chain.unsupported ?? false;
  }, [accountData?.address, accountNetwork.chain]);

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {validChainConnected ? (
        <CreateUTXO />
      ) : (
        <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
          {accountData?.address == undefined && (
            <p>Please connect your wallet in order to mint gmJEWEL</p>
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
    </div>
  );
}
