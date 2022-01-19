import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useAccount, useContractRead } from "wagmi";
import { abis } from "../../utils/env";

export function useERC20(
  tokenAddress: string,
  spender?: string
): {
  balance: BigNumber | undefined;
  totalSupply: BigNumber | undefined;
  allowance: BigNumber | undefined;
} {
  const [{ data: accountData }] = useAccount();
  const args = useMemo(() => [accountData?.address], [accountData?.address]);
  const argsSpender = useMemo(() => {
    if (!spender) return [];
    return [accountData?.address, spender];
  }, [accountData?.address, spender]);

  const [{ data: balance }] = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    {
      watch: true,
      args,
    }
  );
  const [{ data: totalSupply }] = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: abis.ERC20,
    },
    "totalSupply",
    {
      watch: true,
      args,
    }
  );
  const [{ data: allowance }] = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: abis.ERC20,
    },
    "allowance",
    {
      watch: true,
      args: argsSpender,
    }
  );

  return {
    balance: balance as any,
    totalSupply: totalSupply as any,
    allowance: allowance as any,
  };
}
