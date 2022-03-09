import React from "react";
import Alert from "../../components/Alert";
import Back from "../../components/Back";
import Container from "../../components/Container";
import Dots from "../../components/Dots";
import Empty from "../../components/Empty";
import FullPositionCard from "../../components/PositionCard";
import Typography from "../../components/Typography";
import Web3Connect from "../../components/Web3Connect";
import { MasterJewelerFarms } from "../../config/chef";
import { usePairsWithLiquidity } from "../../hooks/usePairsWithLiquidity";
import { useUserInfos } from "../../hooks/useStakingInfo";
import { ChainId } from "../../package";
import { useActiveWeb3React } from "../../services/web3";

export default function PoolPage() {
  const { account, chainId } = useActiveWeb3React();
  const { loading, pairs } = usePairsWithLiquidity();
  const stakingPairs = useUserInfos(MasterJewelerFarms[ChainId.HARMONY]);

  return (
    <Container id="pool-page" className="space-y-6" maxWidth="2xl">
      <div className="p-4 mb-3 space-y-3">
        <Back />

        <Typography component="h1" variant="h2">
          {`My Liquidity Positions`}
        </Typography>
      </div>

      <Alert
        title={`Liquidity Provider Rewards`}
        message={`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                          the pool. Fees are added to the pool, accrue in real time and can be claimed by
                          withdrawing your liquidity`}
        type="information"
      />

      {!account ? (
        <Web3Connect className="w-full !bg-taupe-400 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px]" />
      ) : (
        <div className="p-4 space-y-4 rounded bg-taupe-400">
          <div className="grid grid-flow-row gap-3">
            {loading ? (
              <Empty>
                <Dots>{`Loading`}</Dots>
              </Empty>
            ) : pairs?.length > 0 ? (
              <>
                {/* <div className="flex items-center justify-center">
                    <ExternalLink
                      href={"https://analytics.sushi.com/user/" + account}
                    >
                      Account analytics and accrued fees <span> ↗</span>
                    </ExternalLink>
                  </div> */}
                {pairs.map((v2Pair) => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    stakedBalance={
                      Object.values(stakingPairs).find(
                        (i) =>
                          i?.LPToken.address == v2Pair.liquidityToken.address
                      )?.amount
                    }
                  />
                ))}
              </>
            ) : (
              <Empty className="flex text-lg text-center text-low-emphesis">
                <div className="px-4 py-2">{`No liquidity was found. `}</div>
              </Empty>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
