import { useCallback, useState } from "react";
import { useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/env";
import { BigNumber, } from "ethers";

export function useRedeemFromUTXO(utxoAddress: string, jewelAmount: BigNumber): [() => Promise<void>, boolean] {
  const [loading, setLoading] = useState(false);
  const [, write] = useContractWrite(
    {
      addressOrName: addresses.PawnShop,
      contractInterface: abis.PawnShop,
    },
    "redeemUTXOForFullCombinedValue"
  );

  const fn = useCallback(async () => {
    try {
      setLoading(true)
      const output = await write({ args: [utxoAddress, jewelAmount] });
      await output.data?.wait(2);
    } catch(err) {
      console.error(err) // todo: error toast
    } finally {
      setLoading(false)
    }
  }, [utxoAddress, jewelAmount, write]);

  return [fn, loading];
}
