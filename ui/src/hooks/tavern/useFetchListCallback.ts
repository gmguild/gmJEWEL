import { nanoid } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { resolveENSContentHash } from "../../functions/ens";
import { getNetworkLibrary } from "../../functions/getNetworkLibrary";
import { getTokenList } from "../../functions/list";
import { ChainId } from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { useAppDispatch } from "../../state/hooks";
import { fetchTokenList } from "../../state/lists/actions";
import { TokenList } from "../../state/lists/types";

export function useFetchListCallback(): (
  listUrl: string,
  sendDispatch?: boolean
) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!library || chainId !== ChainId.MAINNET) {
        if (chainId === ChainId.MAINNET) {
          const networkLibrary = getNetworkLibrary();
          if (networkLibrary) {
            return resolveENSContentHash(ensName, networkLibrary);
          }
        }
        throw new Error("Could not construct mainnet ENS resolver");
      }
      return resolveENSContentHash(ensName, library);
    },
    [chainId, library]
  );

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid();
      sendDispatch &&
        dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch &&
            dispatch(
              fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId })
            );
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            );
          throw error;
        });
    },
    [dispatch, ensResolver]
  );
}
