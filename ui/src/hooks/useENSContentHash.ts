import { namehash } from "ethers/lib/utils";
import { useMemo } from "react";
import { isZero } from "../functions/validate";
import { useSingleCallResult } from "../state/multicall/hooks";
import {
  useENSRegistrarContract,
  useENSResolverContract,
} from "./contract/useContract";

export default function useENSContentHash(ensName?: string | null): {
  loading: boolean;
  contenthash: string | null;
} {
  const ensNodeArgument = useMemo(() => {
    if (!ensName) return [undefined];
    try {
      return ensName ? [namehash(ensName)] : [undefined];
    } catch (error) {
      return [undefined];
    }
  }, [ensName]);
  const registrarContract = useENSRegistrarContract(false);
  const resolverAddressResult = useSingleCallResult(
    registrarContract,
    "resolver",
    ensNodeArgument
  );
  const resolverAddress = resolverAddressResult.result?.[0];
  const resolverContract = useENSResolverContract(
    resolverAddress && isZero(resolverAddress) ? undefined : resolverAddress,
    false
  );
  const contenthash = useSingleCallResult(
    resolverContract,
    "contenthash",
    ensNodeArgument
  );

  return {
    contenthash: contenthash.result?.[0] ?? null,
    loading: resolverAddressResult.loading || contenthash.loading,
  };
}
