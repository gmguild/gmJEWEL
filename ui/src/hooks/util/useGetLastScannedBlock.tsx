import axios from "axios";
import { useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { serverUrl } from "../../utils/env";
import { LoadingOrErroredValue, useAsyncValue } from "./useAsyncValue";

export function useGetLastScannedBlock(): [number | null, boolean, LoadingOrErroredValue['forceRefresh']] {
  const [{data: blockNumber}] = useBlockNumber({ watch: true });
  const val = useAsyncValue(() => axios.get(`${serverUrl}/jewel/last-scanned-block`));

  useEffect(() => {
    if(val.loading) return;
    val.refreshWithoutLoading();
  }, [blockNumber])

  if (val.value?.data && typeof val.value?.data === 'number') {
    return [val.value.data, !!val.loading, val.forceRefresh];
  } else {
    return [null, !!val.loading, val.forceRefresh];
  }
}
