import { useMemo } from "react";
import { Currency, CurrencyAmount, JSBI, Token } from "../package";
import { useActiveWeb3React } from "../services/web3";
import {
  useSingleCallResult,
  useSingleContractMultipleData,
} from "../state/multicall/hooks";
import { useMasterChefContract } from "./contract/useContract";

export type FarmResult = {
  amount: CurrencyAmount<Token>;
  rewardDebt: CurrencyAmount<Token>;
  LPToken: Token;
};

export function useUserInfo(farmId: string, token: Currency) {
  const { account } = useActiveWeb3React();

  const contract = useMasterChefContract();

  const args = useMemo(() => {
    if (!account) {
      return;
    }
    return [farmId, String(account)];
  }, [farmId, account]);

  const result = useSingleCallResult(
    args ? contract : null,
    "userInfo",
    args
  )?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined;
}

export function useUserInfos(farms: Token[]): {
  [farmId: number]: FarmResult | undefined;
} {
  const contract = useMasterChefContract();
  const { account } = useActiveWeb3React();

  const args = useMemo(() => {
    if (!account) {
      return [];
    }
    return farms.map((_, i) => [String(i), String(account)]);
  }, [farms, account]);

  const results = useSingleContractMultipleData(contract, "userInfo", args);

  return useMemo(
    () =>
      farms.reduce<{ [farmId: number]: FarmResult }>((memo, farm, i) => {
        const values = results?.[i]?.result;
        if (values)
          memo[i] = {
            LPToken: farm,
            amount: CurrencyAmount.fromRawAmount(
              farm,
              JSBI.BigInt(values[0].toString())
            ),
            rewardDebt: CurrencyAmount.fromRawAmount(
              farm,
              JSBI.BigInt(values[1].toString())
            ),
          };
        return memo;
      }, {}),
    [farms, results]
  );
}
