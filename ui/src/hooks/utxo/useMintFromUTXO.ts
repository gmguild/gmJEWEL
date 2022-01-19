import { useCallback, useMemo, useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/env";


export function useMintFromUTXO(utxoAddress: string): [() => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);
  const [, write] = useContractWrite(
    {
      addressOrName: addresses.PawnShop,
      contractInterface: abis.PawnShop,
    },
    "mintFromUTXO",
    useMemo(() => ({ args: utxoAddress }), [utxoAddress]),
  );

  const [{ data: accountData }] = useAccount();

  const fn = useCallback(async () => {
    try {
      setLoading(true)
      const output = await write();
      await output.data?.wait(3);
    } catch(err) {
      console.error(err) // todo: error toast
    } finally {
      setLoading(false)
    }
  }, [accountData?.address, write]);

  return [fn, loading]
}
