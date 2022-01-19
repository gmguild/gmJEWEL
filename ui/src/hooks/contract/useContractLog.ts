import * as React from "react";

import { useBlockNumber, useProvider } from "wagmi";
import { Log } from "@usedapp/core/node_modules/@ethersproject/providers";
import { providers } from "ethers";

type Config = {
  watch?: boolean;
};

type State = {
  response?: Log[];
  error?: Error;
  loading?: boolean;
};

const initialState: State = {
  loading: false,
};

/*
https://docs.ethers.io/v5/concepts/events/#events--filters
Could either build contract object or filter directly
contract.filters.Transfer(myAddress)
// {
//   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
//   topics: [
//     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72'
//   ]
// }
*/
export const useContractLog = (
  filter: providers.Filter,
  { watch }: Config = {}
) => {
  const provider = useProvider();

  const [{ data: blockNumber }] = useBlockNumber({ skip: true, watch });
  const [state, setState] = React.useState<State>(initialState);

  const read = React.useCallback(async () => {
    try {
      setState((x) => ({ ...x, loading: true }));
      filter.fromBlock = 21814293;
      filter.toBlock = blockNumber;
      const response = (await provider.getLogs(filter)) as Log[];
      setState((x) => ({ ...x, loading: false, response }));
    } catch (error_) {
      const error = <Error>error_;
      setState((x) => ({ ...x, error, loading: false }));
      return { data: undefined, error };
    }
  }, [filter]);

  React.useEffect(() => {
    if (!watch) return;
    if (!blockNumber) return;
    read();
  }, [blockNumber]);

  return {
    data: state.response,
    error: state.error,
    loading: state.loading,
  };
};
