import { useCallback, useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/env";
import { toBytes32 } from "../../utils/conversion";

export function useCreateUTXO(): [() => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);
  const [, write] = useContractWrite(
    {
      addressOrName: addresses.PawnShop,
      contractInterface: abis.PawnShop,
    },
    "createUTXOWithProfile",
  );
  const [{ data: accountData }] = useAccount();

  const fn = useCallback(async () => {
    try {
      setLoading(true);
      const name = (+new Date()).toString(36).slice(-15);
      console.debug("Calling with args", [toBytes32(name)]);
      const output = await write({
        args: [toBytes32(name)],
      });
      console.log(output);
      console.debug("Waiting...")
      await output.data?.wait(1);
      console.debug("Waited!")
    } catch(err) {
      console.error(err); // todo: error toast
    } finally {
      setLoading(false)
    }
  }, [accountData?.address, write]);

  return [fn, loading]
}
