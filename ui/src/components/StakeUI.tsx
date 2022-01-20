import { BigNumber, ethers } from "ethers";
import React, { useMemo } from "react";
import { useERC20Approve } from "../hooks/token/useERC20Approve";
import { useUnstakeLPToken } from "../hooks/staking/useUnstakeLPToken";
import { useStakeLPToken } from "../hooks/staking/useStakeLPToken";
import { addresses } from "../utils/env";
import { BigNumberToFloat } from "../utils/conversion";
import { useLPToken } from "../hooks/staking/useLPToken";
import { useFormattedBigNumber } from "../hooks/util/useFormattedBigNumber";
import { useERC20 } from "../hooks/token/useERC20";
import { useStakeGMG } from "../hooks/staking/useStakeGMG";
import { useUnstakeGMG } from "../hooks/staking/useUnstakeGMG";
import { TextFieldWithMax } from "./TextFieldWithMax";
import { Button } from "./Button";
import { usexGMGToken } from "../hooks/staking/usexGMGToken";
import { B_0 } from "../utils/constants";
import { Spinner } from "./Spinner";
import { useStakingAPY } from "../hooks/staking/useStakingAPY";

interface IStakeUI {
  poolId: number;
  LPToken: string;
  tokenName: string;
}

export function StakeMasterJewelerUI(props: IStakeUI) {
  const [depositValue, setDepositValue] = React.useState<BigNumber>(
    BigNumber.from(0)
  );
  const [withdrawValue, setWithdrawValue] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  const [{ balance, allowance, stakedBalance, pendingReward }, loadingLpToken] =
    useLPToken(props.LPToken, props.poolId);

  const formattedBalance = useMemo(() => {
    if (!balance) return "?.??";
    return BigNumberToFloat(balance).toFixed(2);
  }, [balance]);

  const formattedStakedBalance = useMemo(() => {
    if (!stakedBalance) return "?.??";
    return BigNumberToFloat(stakedBalance).toFixed(2);
  }, [stakedBalance]);

  const formattedPendingRewards = useMemo(() => {
    if (!pendingReward) return "?.??";
    return BigNumberToFloat(pendingReward).toFixed(2);
  }, [pendingReward]);

  const [approve, approving] = useERC20Approve(
    props.LPToken,
    addresses.MasterJeweler
  );
  const [stake, staking] = useStakeLPToken(props.poolId, depositValue);
  const [unstake, unstaking] = useUnstakeLPToken(props.poolId, withdrawValue);
  const [claimRewards, claimingRewards] = useUnstakeLPToken(
    props.poolId,
    BigNumber.from(0)
  );

  const APY = useStakingAPY(props.poolId);

  const formattedAPY = useMemo(() => {
    if (!APY) return "";
    return APY.toFixed(1);
  }, [APY]);

  const loadingInformation = loadingLpToken;
  const doing =
    loadingInformation || approving || staking || unstaking || claimingRewards;

  return (
    <div className="bg-rune-edge p-4 rounded-md shadow-lg border-rune border-8 flex flex-col items-center justify-center">
      <h3 className="text-xl text-white">{props.tokenName}</h3>
      <p className="text-gray-300">APY: {formattedAPY}%</p>
      {pendingReward && pendingReward.gt(BigNumber.from(0)) && (
        <div className="flex flex-row items-center">
          <p className="text-gray-300/50">
            Pending rewards{" "}
            <span className="text-gray-100">
              {loadingInformation ? "...loading..." : formattedPendingRewards}
            </span>
          </p>

          <Button
            className="mx-3"
            disabled={doing}
            onClick={() => claimRewards()}
          >
            Claim
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-content-between">
        <div>
          <h4 className="text-lg text-gray-300 text-center">Deposit</h4>
          <p className="text-gray-300/50">
            LP tokens in inventory{" "}
            <span className="text-gray-100">
              {loadingInformation ? "...loading..." : formattedBalance}
            </span>
          </p>
          <TextFieldWithMax
            updateValue={setDepositValue}
            maxValue={balance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            {allowance && balance && allowance.lt(balance) && (
              <Button disabled={doing} onClick={() => approve()}>
                Approve
              </Button>
            )}
            <Button
              onClick={() => depositValue.gt(B_0) && stake()}
              disabled={
                doing ||
                !balance ||
                !allowance ||
                balance.eq(BigNumber.from(0)) ||
                allowance.lt(balance)
              }
            >
              Deposit
            </Button>
          </div>
        </div>
        <div>
          <h4 className="text-lg text-gray-300 text-center">Withdraw</h4>
          <p className="text-gray-300/50">
            Staked LP Tokens{" "}
            <span className="text-gray-100">
              {loadingInformation ? "...loading..." : formattedStakedBalance}
            </span>
          </p>
          <TextFieldWithMax
            updateValue={setWithdrawValue}
            maxValue={stakedBalance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            <Button
              disabled={
                doing ||
                !stakedBalance ||
                !withdrawValue ||
                withdrawValue.eq(0) ||
                stakedBalance.eq(0)
              }
              onClick={() => withdrawValue.gt(B_0) && unstake()}
            >
              Unstake
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StakedGMGUI() {
  const [{ balance, allowance }, loadingGMGToken] = useERC20(
    addresses.GMGToken,
    addresses.xGMG
  );
  const [{ balance: stakedBalance }, loadingStakedBalance] = useERC20(
    addresses.xGMG
  );

  const [{ ratio }, loadingxGMGToken] = usexGMGToken();

  const formattedBalance = useFormattedBigNumber(balance, " GMG");
  const formattedStakedBalance = useFormattedBigNumber(stakedBalance, " xGMG");
  const formattedRatio = useFormattedBigNumber(ratio);

  const [depositValue, setDepositValue] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  const [withdrawValue, setWithdrawValue] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  const [approve, approving] = useERC20Approve(
    addresses.GMGToken,
    addresses.xGMG
  );
  const [stake, staking] = useStakeGMG(depositValue);
  const [unstake, unstaking] = useUnstakeGMG(withdrawValue);

  const loadingInformation =
    loadingGMGToken || loadingStakedBalance || loadingxGMGToken;
  const doing = loadingInformation || approving || staking || unstaking;

  return (
    <div className="bg-rune-edge p-8 rounded-md shadow-lg border-rune border-8 flex flex-col items-center justify-center">
      <h3 className="text-xl text-white">xGMG single sided staking pool</h3>
      <p className="text-gray-300/50">
        Staking Ratio:{" "}
        <span className="text-gray-100">
          {loadingInformation ? "...loading..." : formattedRatio}
        </span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-content-between">
        <div>
          <h4 className="text-lg text-gray-300 text-center">Deposit</h4>
          <p className="text-gray-300/50">
            GMG in inventory{" "}
            <span className="text-gray-100">
              {loadingInformation ? "...loading..." : formattedBalance}
            </span>
          </p>
          <TextFieldWithMax
            updateValue={setDepositValue}
            maxValue={balance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            {allowance && balance && allowance.lt(balance) && (
              <Button disabled={doing} onClick={() => approve()}>
                Approve
              </Button>
            )}
            <Button
              onClick={() => depositValue.gt(B_0) && stake()}
              disabled={
                doing ||
                !balance ||
                !allowance ||
                balance.eq(BigNumber.from(0)) ||
                allowance.lt(balance)
              }
            >
              Deposit
            </Button>
          </div>
        </div>
        <div>
          <h4 className="text-lg text-gray-300 text-center">Withdraw</h4>
          <p className="text-gray-300/50">
            Staked GMG{" "}
            <span className="text-gray-100">
              {loadingInformation ? "...loading..." : formattedStakedBalance}
            </span>
          </p>
          <TextFieldWithMax
            updateValue={setWithdrawValue}
            maxValue={stakedBalance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            <Button
              disabled={
                doing ||
                !stakedBalance ||
                !withdrawValue ||
                withdrawValue.eq(0) ||
                stakedBalance.eq(0)
              }
              onClick={() => withdrawValue.gt(B_0) && unstake()}
            >
              Unstake
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
