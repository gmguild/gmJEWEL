import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/env";


export function useStakeLPToken(poolId: number, amount: BigNumber) {
  const [, write] = useContractWrite(
    {
      addressOrName: addresses.MasterJeweler,
      contractInterface: abis.MasterJeweler,
    },
    "deposit",
    {
      args: [poolId, amount],
    }
  );

  return useCallback(async () => {
    const output = await write();
    await output.data?.wait(1);
  }, [write]);
}
