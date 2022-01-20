import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import { abis } from "../../utils/env";

export function useERC20(
  tokenAddress: string,
  spender?: string
): [{
  balance: BigNumber | undefined;
  totalSupply: BigNumber | undefined;
  allowance: BigNumber | undefined;
}, boolean] {
  const [loading, setLoading] = useState(true);
  const [{
    data: blockNumber
  }] = useBlockNumber({
    watch: true
  });
  const [{ data: accountData }] = useAccount();

  const args = useMemo(() => [accountData?.address], [accountData?.address]);
  const argsSpender = useMemo(() => {
    if (!spender) return [];
    return [accountData?.address, spender];
  }, [accountData?.address, spender]);

  const [{ data: balance }, readBalance] = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: abis.ERC20,
    },
    "balanceOf",
    useMemo(() => ({
      skip: true,
    }), []),
  );
  const [{ data: totalSupply }, readTotalSupply] = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: abis.ERC20,
    },
    "totalSupply",
    useMemo(() => ({
      skip: true,
    }), []),
  );
  const [{ data: allowance }, readAllowance] = useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: abis.ERC20,
    },
    "allowance",
    useMemo(() => ({
      skip: true,
    }), []),
  );

  useEffect(() => {
    if(!blockNumber) return;
    if(loading) return;

    Promise.allSettled([
      readBalance({ args: args }),
      readTotalSupply(),
      readAllowance({ args: argsSpender }),
    ])
  }, [blockNumber]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      readBalance({ args: args }),
      readTotalSupply(),
      readAllowance({ args: argsSpender }),
    ]).finally(() => setLoading(false));
  }, [args, argsSpender])

  return [{
    balance: balance as any,
    totalSupply: totalSupply as any,
    allowance: allowance as any,
  }, loading];
}
