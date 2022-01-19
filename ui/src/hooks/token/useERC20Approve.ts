import { ethers } from "ethers";
import { useCallback } from "react";
import { useContractWrite } from "wagmi";
import { abis } from "../../utils/contracts";

export function useERC20Approve(ERC20Address: string, spender: string) {
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

  return useCallback(async () => {
    const output = await write();
    await output.data?.wait(1);
  }, [write]);
}
