import { Contract } from "ethers";
import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { MULTICALL2_ADDRESS } from "../../package";
import { useActiveWeb3React } from "../../services/web3/hooks/useActiveWeb3React";
import { AddressZero } from "@ethersproject/constants";
import ERC20_ABI from "../../constants/abi/erc20.json";
import { ERC20_BYTES32_ABI } from "../../constants/abi/erc20";
import MULTICALL2_ABI from "../../constants/abi/multicall.json";
import { getContract } from "../../functions/contract";

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
