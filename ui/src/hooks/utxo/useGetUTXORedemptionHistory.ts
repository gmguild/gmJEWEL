import { useBlockNumber } from "wagmi";
import { LoadingOrErroredValue, useAsyncValue } from "../util/useAsyncValue";
import axios from "axios";
import type { UTXORedemptionRecord } from "./types";
import { serverUrl } from "../../utils/env";
import { useEffect } from "react";


export function useGetUTXORedemptionHistory(): [UTXORedemptionRecord[], boolean, LoadingOrErroredValue['forceRefresh']] {
  const [{data: blockNumber}] = useBlockNumber();
  const val = useAsyncValue(
    () => axios.get(`${serverUrl}/jewel/utxo/redemption-history`, {
      params: { limit: 10 },
    }),
    [],
  );

  useEffect(() => {
    if(val.loading) return;
    val.refreshWithoutLoading();
  }, [blockNumber])

  if (val?.value?.data) {
    return [val?.value?.data, val.loading, val.forceRefresh];
  } else {
    return [[], val.loading, val.forceRefresh];
  }
}
