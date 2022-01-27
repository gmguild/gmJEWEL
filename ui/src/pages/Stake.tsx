import React from "react";
import { useAccount, useNetwork } from "wagmi";
import { ChangeNetwork } from "../components/ChangeNetwork";
import { StakedGMGUI, StakeMasterJewelerUI } from "../components/StakeUI";
import { addresses } from "../utils/env";

export default function Stake() {
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
        <article className="font-lora prose mx-auto pb-32">
          <StakeComponent />
        </article>
      ) : (
        <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
          {accountData?.address == undefined && (
            <p className="font-bold">
              Please connect your wallet in order to stake with GMG
            </p>
          )}
          {accountNetwork.chain?.unsupported && <ChangeNetwork />}
        </article>
      )}
    </div>
  );
}

const StakeComponent = () => {
  return (
    <div>
      <h4 className="text-center">
        There are multiple ways of obtaining yield with the Greedy Merchants
        Guild!
      </h4>
      <hr />
      <section>
        <p>
          Provide liquidity to the JEWEL - gmJEWEL pair on DefiKingdoms exchange
          to receive rewards in $GMG. You will also receive trading fees for
          every trade made against this pair.
        </p>
        <StakeMasterJewelerUI
          poolId={0}
          LPToken={addresses.JgmJLPToken}
          tokenName="JEWEL-gmJEWEL LP token"
        />
      </section>
      <hr />
      <section>
        <p>
          Provide liquidity to the JEWEL - GMG pair on DefiKingdoms exchange to
          receive further rewards in $GMG.
        </p>
        <StakeMasterJewelerUI
          poolId={1}
          LPToken={addresses.JGMGLPToken}
          tokenName="JEWEL-GMG LP token"
        />
      </section>
      <hr />
      <section>
        <p>
          Stake your GMG to receive your share of 100% of the redemption fees
          for gmJEWEL.
        </p>
        <StakedGMGUI />
      </section>
    </div>
  );
};
