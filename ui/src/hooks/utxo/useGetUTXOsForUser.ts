import { useAccount } from "wagmi";
import { LoadingOrErroredValue, useAsyncValue } from "../util/useAsyncValue";
import axios from "axios";
import type { FullUTXO } from "./types";
import { serverUrl } from "../../utils/env";


export function useGetUTXOsForUser(): [FullUTXO[], boolean, LoadingOrErroredValue['forceRefresh']] {
  const [{ data: accountData }] = useAccount();

  const val = useAsyncValue(
    () => axios.get(`${serverUrl}/utxo/user`, {
      params: { address: accountData?.address },
    }),
    [accountData?.address],
  );

  if (val?.value?.data) {
    return [val?.value?.data, val.loading, val.forceRefresh];
  } else {
    return [[], val.loading, val.forceRefresh];
  }
}
