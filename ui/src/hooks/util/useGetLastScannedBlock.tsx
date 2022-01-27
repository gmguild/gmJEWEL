import axios from "axios";
import { serverUrl } from "../../utils/env";
import { LoadingOrErroredValue, useAsyncValue } from "./useAsyncValue";

export function useGetLastScannedBlock(): [number | null, boolean, LoadingOrErroredValue['forceRefresh']] {
  const val = useAsyncValue(() => axios.get(`${serverUrl}/jewel/last-scanned-block`));

  if (val.value?.data && typeof val.value?.data === 'number') {
    return [val.value.data, !!val.loading, val.forceRefresh];
  } else {
    return [null, !!val.loading, val.forceRefresh];
  }
}
