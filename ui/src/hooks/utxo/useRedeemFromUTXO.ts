import { useCallback, useState } from "react";
import { useContractWrite } from "wagmi";
import { abis, addresses } from "../../utils/env";
import { BigNumber } from "ethers";

export function useRedeemFromUTXO(
  utxoAddress: string,
  jewelAmount: BigNumber
): [() => Promise<boolean>, boolean] {
  const [loading, setLoading] = useState(false);
  const [, write] = useContractWrite(
    {
      addressOrName: addresses.PawnShopRouter,
      contractInterface: abis.PawnShopRouter,
    },
    "fullRedeem"
  );

  console.log("fullRedeem", utxoAddress, jewelAmount.toString());

  const fn = useCallback(async () => {
    try {
      setLoading(true);
      const output = await write({
        args: [utxoAddress, jewelAmount.toString()],
        overrides: { gasLimit: BigNumber.from("500000") },
      });
      if (output.error) throw output.error;
      await output.data?.wait(2);
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err); // todo: error toast
      setLoading(false);
      return false;
    }
  }, [utxoAddress, jewelAmount, write]);

  return [fn, loading];
}
