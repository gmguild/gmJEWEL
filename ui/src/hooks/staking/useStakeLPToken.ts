import { BigNumber } from "ethers";
import { useCallback, useState } from "react";
import { useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/env";


export function useStakeLPToken(poolId: number, amount: BigNumber): [() => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);
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

  const fn = useCallback(async () => {
    try {
      setLoading(true);
      const output = await write();
      if(output.error) throw output.error;
      await output.data?.wait(2);
    } catch(err) {
      console.error(err); // todo: error toast
    } finally {
      setLoading(false)
    }  }, [write]);

  return [fn, loading]
}
