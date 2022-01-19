import { BigNumber, ethers } from "ethers";
import React, { useMemo } from "react";
import { useERC20Approve } from "../hooks/token/useERC20Approve";
import { useUnstakeLPToken } from "../hooks/staking/useUnstakeLPToken";
import { useStakeLPToken } from "../hooks/staking/useStakeLPToken";
import { addresses } from "../utils/contracts";
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

  const { balance, allowance, stakedBalance, pendingReward } = useLPToken(
    props.LPToken,
    props.poolId
  );

  const formattedBalance = useMemo(() => {
    if (!balance) return "0";
    return BigNumberToFloat(balance).toFixed(2);
  }, [balance]);

  const formattedStakedBalance = useMemo(() => {
    if (!stakedBalance) return "0";
    return BigNumberToFloat(stakedBalance).toFixed(2);
  }, [stakedBalance]);

  const approve = useERC20Approve(props.LPToken, addresses.MasterJeweler);

  const formattedPendingRewards = useMemo(() => {
    if (!pendingReward) return "0";
    return BigNumberToFloat(pendingReward).toFixed(2);
  }, [pendingReward]);

  // todo: loading state for this page
  const stake = useStakeLPToken(props.poolId, depositValue);
  const unstake = useUnstakeLPToken(props.poolId, withdrawValue);
  const claimRewards = useUnstakeLPToken(props.poolId, BigNumber.from(0))

  return (
    <div className="bg-rune-edge p-4 rounded-md shadow-lg border-rune border-8 flex flex-col items-center justify-center">
      <h3 className="text-xl text-white">{props.tokenName}</h3>
      {pendingReward && pendingReward.gt(BigNumber.from(0)) && (
        <div className="flex flex-row items-center">
          <p className="text-gray-300/50">
            Pending rewards{" "}
            <span className="text-gray-100">{formattedPendingRewards}</span>
          </p>

          <Button className="ml-3" onClick={() => claimRewards()}>
            Claim
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-8 place-content-between">
        <div>
          <h4 className="text-lg text-gray-300 text-center">Deposit</h4>
          <p className="text-gray-300/50">
            LP tokens in inventory{" "}
            <span className="text-gray-100">{formattedBalance}</span>
          </p>
          <TextFieldWithMax
            updateValue={setDepositValue}
            maxValue={balance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            {allowance && balance && allowance.lt(balance) && (
              <Button onClick={() => approve()}>Approve</Button>
            )}
            <Button
              onClick={() => depositValue.gt(B_0) && stake()}
              disabled={!balance || !allowance || balance.eq(BigNumber.from(0)) || allowance.lt(balance)}
            >
              Deposit
            </Button>
          </div>
        </div>
        <div>
          <h4 className="text-lg text-gray-300 text-center">Withdraw</h4>
          <p className="text-gray-300/50">
            Staked LP Tokens{" "}
            <span className="text-gray-100">{formattedStakedBalance}</span>
          </p>
          <TextFieldWithMax
            updateValue={setWithdrawValue}
            maxValue={stakedBalance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            <Button
              disabled={!stakedBalance || !withdrawValue || withdrawValue.eq(0) || stakedBalance.eq(0)}
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
  const { balance, allowance } = useERC20(addresses.GMGToken, addresses.xGMG);
  const { balance: stakedBalance } = useERC20(addresses.xGMG);

  const { ratio } = usexGMGToken();

  const formattedBalance = useFormattedBigNumber(balance, " GMG");
  const formattedStakedBalance = useFormattedBigNumber(stakedBalance, " xGMG");
  const formattedRatio = useFormattedBigNumber(ratio);

  const [depositValue, setDepositValue] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  const [withdrawValue, setWithdrawValue] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  const approve = useERC20Approve(addresses.GMGToken, addresses.xGMG);
  const stake = useStakeGMG(depositValue);
  const unstake = useUnstakeGMG(withdrawValue);

  return (
    <div className="bg-rune-edge p-8 rounded-md shadow-lg border-rune border-8 flex flex-col items-center justify-center">
      <h3 className="text-xl text-white">xGMG single sided staking pool</h3>
      <p className="text-gray-300/50">
        Staking Ratio: <span className="text-gray-100">{formattedRatio}</span>
      </p>
      <div className="grid grid-cols-2 gap-8 place-content-between">
        <div>
          <h4 className="text-lg text-gray-300 text-center">Deposit</h4>
          <p className="text-gray-300/50">
            GMG in inventory{" "}
            <span className="text-gray-100">{formattedBalance}</span>
          </p>
          <TextFieldWithMax
            updateValue={setDepositValue}
            maxValue={balance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            {allowance && balance && allowance.lt(balance) && (
              <Button onClick={() => approve()}>Approve</Button>
            )}
            <Button
              onClick={() => depositValue.gt(B_0) && stake()}
              disabled={!balance || !allowance || balance.eq(BigNumber.from(0)) || allowance.lt(balance)}
            >
              Deposit
            </Button>
          </div>
        </div>
        <div>
          <h4 className="text-lg text-gray-300 text-center">Withdraw</h4>
          <p className="text-gray-300/50">
            Staked GMG{" "}
            <span className="text-gray-100">{formattedStakedBalance}</span>
          </p>
          <TextFieldWithMax
            updateValue={setWithdrawValue}
            maxValue={stakedBalance ?? BigNumber.from(0)}
          />
          <div className="flex flex-row justify-evenly py-2">
            <Button
              disabled={!stakedBalance || !withdrawValue || withdrawValue.eq(0) || stakedBalance.eq(0)}
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
