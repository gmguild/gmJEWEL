import React from "react";
import { useAccount, useNetwork } from "wagmi";
import { ChangeNetwork } from "../components/ChangeNetwork";
import { DisplayReadOnlyUTXO, RedeemUTXO } from "../components/RedeemUTXO";
import { RedemptionHistoryTable } from "../components/RedemptionHistoryTable";

export default function Redeem() {
  const [{ data: accountData }] = useAccount();
  const [{ data: accountNetwork }] = useNetwork();

  const validChainConnected = React.useMemo(() => {
    if (!accountData?.address) return false;
    if (!accountNetwork.chain) return false;
    return !accountNetwork.chain.unsupported ?? false;
  }, [accountData?.address, accountNetwork.chain]);

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {validChainConnected ? (
        <>
          <RedeemUTXO />
          <RedemptionHistoryTable />
        </>
      ) : (
        <>
          <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
            {accountData?.address == undefined && (
              <p className="font-bold">
                Please connect your wallet in order to redeem gmJEWEL
              </p>
            )}
            {accountNetwork.chain?.unsupported && <ChangeNetwork />}
          </article>
          <DisplayReadOnlyUTXO />
          <RedemptionHistoryTable />
        </>
      )}
    </div>
  );
}
