import { arrayify, parseBytes32String } from "ethers/lib/utils";
import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { createTokenFilterFunction } from "../../functions/filtering";
import { Currency, NATIVE, Token, WNATIVE } from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import {
  TokenAddressMap,
  useAllLists,
  useCombinedActiveList,
  useInactiveListUrls,
} from "../../state/lists/hooks";
import { WrappedTokenInfo } from "../../state/lists/wrappedTokenInfo";
import { NEVER_RELOAD, useSingleCallResult } from "../../state/multicall/hooks";
import { useUserAddedTokens } from "../../state/user/hooks";
import { isAddress } from "../../utils/conversion";
import {
  useBytes32TokenContract,
  useTokenContract,
} from "../contract/useContract";

export function useSearchInactiveTokenLists(
  search: string | undefined,
  minResults = 10
): WrappedTokenInfo[] {
  const lists = useAllLists();
  const inactiveUrls = useInactiveListUrls();
  const { chainId } = useActiveWeb3React();
  const activeTokens = useAllTokens();
  return useMemo(() => {
    if (!search || search.trim().length === 0) return [];
    const tokenFilter = createTokenFilterFunction(search);
    const result: WrappedTokenInfo[] = [];
    const addressSet: { [address: string]: true } = {};
    for (const url of inactiveUrls) {
      const list = lists[url].current;
      if (!list) continue;
      for (const tokenInfo of list.tokens) {
        if (tokenInfo.chainId === chainId && tokenFilter(tokenInfo)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore TYPE NEEDS FIXING
          const wrapped = new WrappedTokenInfo(tokenInfo, list);
          if (
            !(wrapped.address in activeTokens) &&
            !addressSet[wrapped.address]
          ) {
            addressSet[wrapped.address] = true;
            result.push(wrapped);
            if (result.length >= minResults) return result;
          }
        }
      }
    }
    return result;
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search]);
}

export function useIsUserAddedToken(
  currency: Currency | undefined | null
): boolean {
  const userAddedTokens = useUserAddedTokens();

  if (!currency) {
    return false;
  }

  return !!userAddedTokens.find((token) => currency.equals(token));
}

function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean
): { [address: string]: Token } {
  const [{ data }] = useNetwork();
  const chainId = data.chain?.id;
  const userAddedTokens = useUserAddedTokens();

  return useMemo(() => {
    if (!chainId) return {};
    if (!tokenMap[chainId]) return {};

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce<{
      [address: string]: Token;
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token;
      return newMap;
    }, {});

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token;
              return tokenMap;
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      );
    }

    return mapWithoutUrls;
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded]);
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList();
  console.log(allTokens);
  return useTokensFromMap(allTokens, true);
}

export function useToken(
  tokenAddress?: string | null
): Token | undefined | null {
  const [{ data }] = useNetwork();
  const chainId = data.chain?.id;
  const tokens = useAllTokens();

  const address = isAddress(tokenAddress ?? "");

  const tokenContract = useTokenContract(address ? address : undefined, false);
  const tokenContractBytes32 = useBytes32TokenContract(
    address ? address : undefined,
    false
  );
  const token: Token | undefined = address ? tokens[address] : undefined;

  const tokenName = useSingleCallResult(
    token ? undefined : tokenContract,
    "name",
    undefined,
    NEVER_RELOAD
  );
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    "name",
    undefined,
    NEVER_RELOAD
  );
  const symbol = useSingleCallResult(
    token ? undefined : tokenContract,
    "symbol",
    undefined,
    NEVER_RELOAD
  );
  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    "symbol",
    undefined,
    NEVER_RELOAD
  );
  const decimals = useSingleCallResult(
    token ? undefined : tokenContract,
    "decimals",
    undefined,
    NEVER_RELOAD
  );

  const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

  function parseStringOrBytes32(
    str: string | undefined,
    bytes32: string | undefined,
    defaultValue: string
  ): string {
    return str && str.length > 0
      ? str
      : // need to check for proper bytes string and valid terminator
      bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
      ? parseBytes32String(bytes32)
      : defaultValue;
  }

  return useMemo(() => {
    if (token) return token;
    if (tokenAddress === null) return null;
    if (!chainId || !address) return undefined;
    if (decimals.loading || symbol.loading || tokenName.loading) return null;
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(
          symbol.result?.[0],
          symbolBytes32.result?.[0],
          "UNKNOWN"
        ),
        parseStringOrBytes32(
          tokenName.result?.[0],
          tokenNameBytes32.result?.[0],
          "Unknown Token"
        )
      );
    }
    return undefined;
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenAddress,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ]);
}

export function useCurrency(
  currencyId: string | undefined
): Currency | null | undefined {
  const [{ data }] = useNetwork();
  const chainId = data.chain?.id;

  const isETH = currencyId?.toUpperCase() === "ETH";

  const useNative = isETH;

  const token = useToken(useNative ? undefined : currencyId);

  const { native, wnative } = useMemo(
    () => ({
      native: chainId && chainId in NATIVE ? NATIVE[chainId] : undefined,
      wnative: chainId && chainId in WNATIVE ? WNATIVE[chainId] : undefined,
    }),
    [chainId]
  );

  if (wnative?.address?.toLowerCase() === currencyId?.toLowerCase())
    return wnative;

  return useNative ? native : token;
}
