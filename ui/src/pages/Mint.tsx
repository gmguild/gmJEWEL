import React from "react";
import { useAccount } from "wagmi";
import { CreateUTXO } from "../components/CreateUTXO";

export default function Home() {
  const [{ data: accountData }] = useAccount();

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {accountData?.address ? (
        <CreateUTXO />
      ) : (
        <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
          <p>Please connect your wallet in order to mint gmJEWEL</p>
        </article>
      )}
    </div>
  );
}
