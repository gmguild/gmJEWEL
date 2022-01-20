import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { useContractWrite } from "wagmi";
import { abis } from "../../utils/env";

export function useERC20Approve(ERC20Address: string, spender: string): [() => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);
  const [, write] = useContractWrite(
    {
      addressOrName: ERC20Address,
      contractInterface: abis.ERC20,
    },
    "approve",
    {
      args: [spender, ethers.constants.MaxUint256],
    }
  );

  const fn = useCallback(async () => {
    try {
      setLoading(true);
      const output = await write();
      await output.data?.wait(2);
    } catch(err) {
      console.error(err); // todo: error toast
    } finally {
      setLoading(false)
    }  }, [write]);

  return [fn, loading]
}
