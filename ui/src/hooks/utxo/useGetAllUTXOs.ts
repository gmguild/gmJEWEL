import axios from "axios";
import { serverUrl } from "../../utils/env";
import { LoadingOrErroredValue, useAsyncValue } from "../util/useAsyncValue";
import type { FullUTXO } from "./types";


export function useGetAllUTXOs(): [FullUTXO[], boolean, LoadingOrErroredValue['forceRefresh']] {
  const val = useAsyncValue(() => axios.get(`${serverUrl}/jewel/utxo/minted`));

  if (val.value?.data) {
    return [val.value.data, !!val.loading, val.forceRefresh];
  } else {
    return [[], !!val.loading, val.forceRefresh];
  }
}
