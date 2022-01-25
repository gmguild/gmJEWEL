import { useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { LoadingOrErroredValue, useAsyncValue } from "../util/useAsyncValue";
import axios from "axios";
import { serverUrl } from "../../utils/env";
import type { AggSummary } from "./types";


export function useGetAggSummary(): [AggSummary, boolean, LoadingOrErroredValue['forceRefresh']] {
  const [{data: blockNumber}] = useBlockNumber();
  const val = useAsyncValue(
    () => axios.get(`${serverUrl}/jewel/agg/summary`),
    [],
  );

  useEffect(() => {
    if(val.loading) return;
    val.refreshWithoutLoading();
  }, [blockNumber])

  if (val?.value?.data) {
    return [val?.value?.data, val.loading, val.forceRefresh];
  } else {
    return [{
      lockedJewelTotal: null,
      totalFeesPaid: null,
      totalFeesPaidInJewel: null,
      totalRedemptionsVolume: null,
      totalStashes: null,
    }, val.loading, val.forceRefresh];
  }
}
