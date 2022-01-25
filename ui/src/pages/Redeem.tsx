import React from "react";
import { useAccount } from "wagmi";
import { RedeemUTXO } from "../components/RedeemUTXO";
import { RedemptionHistoryTable } from "../components/RedemptionHistoryTable";

export default function Redeem() {
  const [{ data: accountData }] = useAccount();

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {accountData?.address ? (
        <>
          <RedeemUTXO />
          <RedemptionHistoryTable />
        </>
      ) : (
        <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
          <p>Please connect your wallet in order to redeem gmJEWEL</p>
        </article>
      )}
    </div>
  );
}
