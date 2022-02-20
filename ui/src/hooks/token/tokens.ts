import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { Currency, Token } from "../../package";
import {
  TokenAddressMap,
  useCombinedActiveList,
} from "../../state/lists/hooks";
import { useUserAddedTokens } from "../../state/user/hooks";
import { isAddress } from "../../utils/conversion";

function useTokensFromMap(
  tokenMap: TokenAddressMap,
  includeUserAdded: boolean
): { [address: string]: Token } {
  const [{ data }] = useNetwork();
  const chainId = data.chain?.id;
  const userAddedTokens = useUserAddedTokens();

  return useMemo(() => {
    if (!chainId) return {};

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
      //eslint-disable-next-line
      // @ts-ignore TYPE NEEDS FIXING
      native: chainId && chainId in NATIVE ? NATIVE[chainId] : undefined,
      wnative: chainId && chainId in WNATIVE ? WNATIVE[chainId] : undefined,
    }),
    [chainId]
  );

  if (wnative?.address?.toLowerCase() === currencyId?.toLowerCase())
    return wnative;

  return useNative ? native : token;
}
