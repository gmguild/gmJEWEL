import React from "react";
import { useAccount } from "wagmi";
import { StakedGMGUI, StakeMasterJewelerUI } from "../components/StakeUI";
import { addresses } from "../utils/env";

export default function Stake() {
  const [{ data: accountData }] = useAccount();

  return (
    <div className="max-w-5xl mx-auto">
      <article className="font-lora prose mx-auto pb-32">
        {accountData?.address ? (
          <div>
            <h4 className="text-center">
              There are multiple ways of obtaining yield with the Greedy
              Merchant Guild!
            </h4>
            <hr />
            <section>
              <p>
                Provide liquidity to the JEWEL - GMG pair on DefiKingdoms exchange
                to receive further rewards in $GMG.
              </p>
              <StakeMasterJewelerUI
                poolId={0}
                LPToken={addresses.JGMGLPToken}
                tokenName="JEWEL-GMG LP token"
              />
            </section>
            <hr />
            <section>
              <p>
                Provide liquidity to the JEWEL - gmJEWEL pair on DefiKingdoms
                exchange to receive rewards in $GMG. You will also receive trading
                fees for every trade made against this pair.
              </p>
              <StakeMasterJewelerUI
                poolId={1}
                LPToken={addresses.JgmJLPToken}
                tokenName="JEWEL-gmJEWEL LP token"
              />
            </section>
            <hr />
            <section>
              <p>
                Stake your GMG to receive your share of 100% of the redemption
                fees for gmJEWEL.
              </p>
              <StakedGMGUI />
            </section>
          </div>
        ) : (
          <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
            <p>Please connect your wallet in order to stake</p>
          </article>
        )}
      </article>
    </div>
  );
}
