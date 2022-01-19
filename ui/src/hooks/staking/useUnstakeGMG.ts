import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/contracts";

export function useUnstakeGMG(amount: BigNumber) {
  const [, write] = useContractWrite(
    {
      addressOrName: addresses.xGMG,
      contractInterface: abis.xGMG,
    },
    "leave",
    {
      args: [amount],
    }
  );

  return useCallback(async () => {
    const output = await write();
    await output.data?.wait(1);
  }, [write]);
}
