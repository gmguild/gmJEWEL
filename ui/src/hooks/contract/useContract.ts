import { Contract } from "ethers";
import { useMemo } from "react";
import { useNetwork } from "wagmi";
import {
  ChainId,
  ENS_REGISTRAR_ADDRESS,
  MULTICALL2_ADDRESS,
  ROUTER_ADDRESS,
  WNATIVE_ADDRESS,
} from "../../package";
import { useActiveWeb3React } from "../../services/web3/hooks/useActiveWeb3React";
import { AddressZero } from "@ethersproject/constants";
import ENS_ABI from "../../constants/abi/ens-registrar.json";
import ENS_PUBLIC_RESOLVER_ABI from "../../constants/abi/ens-public-resolver.json";
import ERC20_ABI from "../../constants/abi/erc20.json";
import { ERC20_BYTES32_ABI } from "../../constants/abi/erc20";
import MULTICALL2_ABI from "../../constants/abi/multicall2.json";
import { getContract } from "../../functions/contract";
import WETH9_ABI from "../../constants/abi/weth9.json";
import ROUTER_ABI from "../../constants/abi/router.json";
import IUniswapV2PairABI from "../../constants/abi/uniswap-v2-pair.json";
import EIP_2612_ABI from "../../constants/abi/eip-2612.json";
import { abis, addresses } from "../../utils/env";

export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();
  return useMemo(() => {
    if (!address || address == AddressZero || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useMulticall2Contract() {
  const [{ data }] = useNetwork();
  const chainId = data.chain?.id;
  return useContract(
    chainId ? MULTICALL2_ADDRESS[chainId] : undefined,
    MULTICALL2_ABI,
    false
  );
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? ENS_REGISTRAR_ADDRESS[chainId] : undefined,
    ENS_ABI,
    withSignerIfPossible
  );
}

export function useWETH9Contract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? WNATIVE_ADDRESS[chainId] : undefined,
    WETH9_ABI,
    withSignerIfPossible
  );
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useRouterContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useContract(ROUTER_ADDRESS[chainId], ROUTER_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false);
}

export function useMasterChefContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.HARMONY ? addresses.MasterJeweler : undefined,
    abis.MasterJeweler,
    withSignerIfPossible
  );
}
