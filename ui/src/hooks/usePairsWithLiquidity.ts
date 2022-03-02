import { useMemo } from "react";
import { Pair } from "../package";
import { useActiveWeb3React } from "../services/web3";
import { toV2LiquidityToken, useTrackedTokenPairs } from "../state/user/hooks";
import { useTokenBalancesWithLoadingIndicator } from "../state/wallet/hooks";
import { usePairs } from "./tavern/usePairs";

interface PairsWithLiquidity {
  loading: boolean;
  pairs: Pair[];
}

export const usePairsWithLiquidity = (): PairsWithLiquidity => {
  const { account } = useActiveWeb3React();
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const { data: v2PairsBalances, loading: fetchingV2PairBalances } =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0")
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  return { loading: v2IsLoading, pairs: allV2PairsWithLiquidity };
};
