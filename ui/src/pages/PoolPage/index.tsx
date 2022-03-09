import React from "react";
import { useNavigate } from "react-router";
import Alert from "../../components/Alert";
import Back from "../../components/Back";
import Button from "../../components/Button";
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
import { addresses } from "../../utils/env";

export default function PoolPage() {
  const navigate = useNavigate();

  const { account, chainId } = useActiveWeb3React();
  const { loading, pairs } = usePairsWithLiquidity();
  const stakingPairs = useUserInfos(MasterJewelerFarms[ChainId.HARMONY]);

  return (
    <Container id="pool-page" className="space-y-6" maxWidth="2xl">
      <Alert
        title={`Liquidity Provider Rewards`}
        message={
          <>
            <p>
              Liquidity providers earn a 0.25% fee on all trades proportional to their share of
              the pool. Fees are added to the pool, accrue in real time and can be claimed by
              withdrawing your liquidity
            </p>
            <br />
            <p className="underline">NOTE: your staked liquidity will not be shown here! Please visit the &quot;Stake&quot; page and unstake to manage your liquidity positions.</p>
          </>
        }
        type="information"
        dismissable={false}
      />

      {!account ? (
        <Web3Connect className="w-full !bg-taupe-400 bg-gradient-to-r from-pink/80 hover:from-pink to-purple/80 hover:to-purple text-white h-[38px]" />
      ) : (
        <div className="p-4 space-y-4 rounded bg-taupe-400">
          <Button
            size="sm"
            color="gradient"
            onClick={() => {
              navigate(
                `/pool/add/${addresses.JewelToken}/${addresses.gmJEWEL}`
              );
            }}
          >
            {`Add Liquidity`}
          </Button>

          <div className="grid grid-flow-row gap-3">
            {loading ? (
              <Empty>
                <Dots>{`Loading`}</Dots>
              </Empty>
            ) : pairs?.length > 0 ? (
              <>
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
              <Empty className="flex text-lg text-center text-high-emphesis">
                <div className="px-4 py-2">{`No liquidity was found. `}</div>
              </Empty>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
