import axios from "axios";
import { LoadingOrErroredValue, useAsyncValue } from "../util/useAsyncValue";
import type { FullUTXO } from "./types";


export function useGetAllUTXOs(): [FullUTXO[], boolean, LoadingOrErroredValue['forceRefresh']] {
  const val = useAsyncValue(() => axios.get("http://127.0.0.1:8000/utxo/minted"));

  if (val.value?.data) {
    return [val.value.data, !!val.loading, val.forceRefresh];
  } else {
    return [[], !!val.loading, val.forceRefresh];
  }
}
