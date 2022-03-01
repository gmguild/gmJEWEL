import React, { useCallback } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { TransactionResponse } from "@ethersproject/providers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZERO_PERCENT } from "../../constants";
import { maxAmountSpend } from "../../functions/currency";
import {
  calculateGasMargin,
  calculateSlippageAmount,
} from "../../functions/trade";
import { useRouterContract } from "../../hooks/contract/useContract";
import { useCurrency } from "../../hooks/token/tokens";
import {
  ApprovalState,
  useApproveCallback,
} from "../../hooks/useApproveCallback";
import useTransactionDeadline from "../../hooks/useTransactionDeadline";
import {
  Currency,
  CurrencyAmount,
  currencyEquals,
  WNATIVE,
} from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { USER_REJECTED_TX } from "../../services/web3/WalletError";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useAppSelector } from "../../state/hooks";
import { Field } from "../../state/mint/actions";
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from "../../state/mint/hooks";
import { selectSlippage } from "../../state/slippage/slippageSlice";
import { useTransactionAdder } from "../../state/transactions/hooks";
import { useExpertModeManager } from "../../state/user/hooks";
import Container from "../../components/Container";
import NavLink from "../../components/NavLink";
import { currencyId } from "../../functions/currencyId";
import DoubleGlowShadow from "../../components/DoubleGlowShadow";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from "../../modals/TransactionConfirmationModal";
import { Plus } from "react-feather";
import { PairState } from "../../hooks/tavern/usePairs";
import Button from "../../components/Button";
import Web3Connect from "../../components/Web3Connect";
import Dots from "../../components/Dots";
import DoubleCurrencyLogo from "../../components/DoubleLogo";
import ConfirmAddModalBottom from "../../components/Pool/ConfirmAddModalBottom";
import Alert from "../../components/Alert";
import ExchangeHeader from "../../components/Pool/ExchangeHeader";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import { AutoColumn } from "../../components/Column";
import { AutoRow, RowBetween } from "../../components/Row";
import LiquidityPrice from "../../components/Pool/LiquidityPrice";
import { MinimalPositionCard } from "../../components/PositionCard";

export default function PoolPage() {
  const { account, chainId, library } = useActiveWeb3React();
  const navigate = useNavigate();
  //TODO: fix
  const tokens = [""];
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [
    undefined,
    undefined,
  ];

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WNATIVE[chainId])) ||
        (currencyB && currencyEquals(currencyB, WNATIVE[chainId])))
  );

  const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  const [isExpertMode] = useExpertModeManager();

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings

  const allowedSlippage = useAppSelector(selectSlippage);

  const [txHash, setTxHash] = useState<string>("");

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity
      ? otherTypedValue
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    };
  }, {});

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0"),
    };
  }, {});

  const routerContract = useRouterContract();

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    routerContract?.address
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    routerContract?.address
  );

  const addTransaction = useTransactionAdder();

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return;

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts;

    // console.log({ parsedAmountA, parsedAmountB, currencyA, currencyB, deadline })

    if (
      !parsedAmountA ||
      !parsedAmountB ||
      !currencyA ||
      !currencyB ||
      !deadline
    ) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? ZERO_PERCENT : allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? ZERO_PERCENT : allowedSlippage
      )[0],
    };

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative;
      estimate = routerContract.estimateGas.addLiquidityETH;
      method = routerContract.addLiquidityETH;
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? "", // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from(
        (tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString()
      );
    } else {
      estimate = routerContract.estimateGas.addLiquidity;
      method = routerContract.addLiquidity;
      args = [
        currencyA?.wrapped?.address ?? "",
        currencyB?.wrapped?.address ?? "",
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(
              3
            )} ${currencies[Field.CURRENCY_A]?.symbol} and ${parsedAmounts[
              Field.CURRENCY_B
            ]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });

          setTxHash(response.hash);
        })
      )
      .catch((error) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error);
        }
      });
  }

  const ModalHeader = noLiquidity ? (
    <div className="pb-4">
      <div className="flex items-center justify-start gap-3">
        <div className="text-2xl font-bold text-high-emphesis">
          {currencies[Field.CURRENCY_A]?.symbol +
            "/" +
            currencies[Field.CURRENCY_B]?.symbol}
        </div>

        <DoubleCurrencyLogo
          currency0={currencyA ?? undefined}
          currency1={currencyB ?? undefined}
          size={48}
        />
      </div>
    </div>
  ) : (
    <div className="pb-4">
      <div className="flex items-center justify-start gap-3">
        <div className="text-xl font-bold md:text-3xl text-high-emphesis">
          {liquidityMinted?.toSignificant(6)}
        </div>
        <div className="grid grid-flow-col gap-2">
          <DoubleCurrencyLogo
            currency0={currencyA ?? undefined}
            currency1={currencyB ?? undefined}
            size={48}
          />
        </div>
      </div>
      <div className="text-lg font-medium md:text-2xl text-high-emphesis">
        {currencies[Field.CURRENCY_A]?.symbol}/
        {currencies[Field.CURRENCY_B]?.symbol}
        &nbsp;{`Pool Tokens`}
      </div>
      <div className="pt-3 text-xs italic text-secondary">
        {`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
          4
        )}% your transaction
              will revert.`}
      </div>
    </div>
  );

  const ModalBottom = (
    <ConfirmAddModalBottom
      price={price}
      currencies={currencies}
      parsedAmounts={parsedAmounts}
      noLiquidity={noLiquidity}
      onAdd={onAdd}
      poolTokenPercentage={poolTokenPercentage}
    />
  );

  const pendingText = `Supplying ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_B]?.symbol
  }`;
  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA);
      if (newCurrencyIdA === currencyIdB) {
        navigate(`add/${currencyIdB}/${currencyIdA}`);
      } else {
        navigate(`add/${newCurrencyIdA}/${currencyIdB}`);
      }
    },
    [currencyIdB, navigate, currencyIdA]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          navigate(`add/${currencyIdB}/${newCurrencyIdB}`);
        } else {
          navigate(`add/${newCurrencyIdB}`);
        }
      } else {
        navigate(`add/${currencyIdA ? currencyIdA : "ETH"}/${newCurrencyIdB}`);
      }
    },
    [currencyIdA, navigate, currencyIdB]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput("");
    }
    setTxHash("");
  }, [onFieldAInput, txHash]);

  return (
    <>
      <Container
        id="add-liquidity-page"
        className="py-4 space-y-6 md:py-8 lg:py-12"
        maxWidth="2xl"
      >
        <div className="flex items-center justify-between px-4 mb-5">
          <NavLink href="/bazaar/pool">
            <a className="flex items-center space-x-2 text-base font-medium text-center cursor-pointer text-secondary hover:text-high-emphesis">
              <span>{`View Liquidity Positions`}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </NavLink>
          {/* <button
              style={{
                backgroundColor: 'rgba(167, 85, 221, 0.25)',
                border: '1px solid #A755DD',
                borderRadius: 20,
                padding: '5px 40px',
                fontSize: 14,
              }}
            >
              FARM THE {currencies[Field.CURRENCY_A]?.symbol}-{currencies[Field.CURRENCY_B]?.symbol} POOL
            </button> */}
        </div>

        <Alert
          message={
            noLiquidity ? (
              `When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click supply to review`
            ) : (
              <>
                <b>{`Tip:`}</b>{" "}
                {`By adding liquidity you'll earn 0.25% of all trades on this pair
                  proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be
                  claimed by withdrawing your liquidity.`}
              </>
            )
          }
          type="information"
        />

        <DoubleGlowShadow>
          <div
            className="p-4 space-y-4 rounded bg-taupe-400"
            style={{ zIndex: 1 }}
          >
            {/* <AddRemoveTabs creating={isCreate} adding={true} defaultSlippage={DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE} /> */}

            <ExchangeHeader
              input={currencies[Field.CURRENCY_A]}
              output={currencies[Field.CURRENCY_B]}
              allowedSlippage={allowedSlippage}
            />

            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash}
              content={
                <ConfirmationModalContent
                  title={
                    noLiquidity ? `You are creating a pool` : `You will receive`
                  }
                  onDismiss={handleDismissConfirmation}
                  topContent={ModalHeader}
                  bottomContent={ModalBottom}
                />
              }
              pendingText={pendingText}
            />
            <div className="flex flex-col space-y-4">
              {/* {pair && pairState !== PairState.INVALID && (
                  <LiquidityHeader input={currencies[Field.CURRENCY_A]} output={currencies[Field.CURRENCY_B]} />
                )} */}

              <div>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(
                      maxAmounts[Field.CURRENCY_A]?.toExact() ?? ""
                    );
                  }}
                  onCurrencySelect={handleCurrencyASelect}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  showCommonBases
                />

                <AutoColumn justify="space-between" className="py-2.5">
                  <AutoRow
                    justify={isExpertMode ? "space-between" : "flex-start"}
                    style={{ padding: "0 1rem" }}
                  >
                    <button className="z-10 -mt-6 -mb-6 rounded-full cursor-default bg-taupe-400 p-3px">
                      <div className="p-3 rounded-full bg-taupe-300">
                        <Plus size="32" />
                      </div>
                    </button>
                  </AutoRow>
                </AutoColumn>

                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(
                      maxAmounts[Field.CURRENCY_B]?.toExact() ?? ""
                    );
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases
                />
              </div>

              {currencies[Field.CURRENCY_A] &&
                currencies[Field.CURRENCY_B] &&
                pairState !== PairState.INVALID && (
                  <div className="p-1 rounded bg-taupe-300">
                    <LiquidityPrice
                      currencies={currencies}
                      price={price}
                      noLiquidity={noLiquidity}
                      poolTokenPercentage={poolTokenPercentage}
                      className="bg-taupe-400"
                    />
                  </div>
                )}

              {!account ? (
                <Web3Connect size="lg" color="blue" className="w-full" />
              ) : (
                (approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING ||
                  isValid) && (
                  <AutoColumn gap={"md"}>
                    {
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <Button
                            color="gradient"
                            size="lg"
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            style={{
                              width:
                                approvalB !== ApprovalState.APPROVED
                                  ? "48%"
                                  : "100%",
                            }}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>
                                {`Approving ${
                                  currencies[Field.CURRENCY_A]?.symbol
                                }`}
                              </Dots>
                            ) : (
                              `Approve ${currencies[Field.CURRENCY_A]?.symbol}`
                            )}
                          </Button>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <Button
                            color="gradient"
                            size="lg"
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            style={{
                              width:
                                approvalA !== ApprovalState.APPROVED
                                  ? "48%"
                                  : "100%",
                            }}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>
                                {`Approving ${
                                  currencies[Field.CURRENCY_B]?.symbol
                                }`}
                              </Dots>
                            ) : (
                              `Approve ${currencies[Field.CURRENCY_B]?.symbol}`
                            )}
                          </Button>
                        )}
                      </RowBetween>
                    }

                    {approvalA === ApprovalState.APPROVED &&
                      approvalB === ApprovalState.APPROVED && (
                        <Button
                          color={
                            !isValid &&
                            !!parsedAmounts[Field.CURRENCY_A] &&
                            !!parsedAmounts[Field.CURRENCY_B]
                              ? "red"
                              : "blue"
                          }
                          onClick={() => {
                            isExpertMode ? onAdd() : setShowConfirm(true);
                          }}
                          disabled={
                            !isValid ||
                            approvalA !== ApprovalState.APPROVED ||
                            approvalB !== ApprovalState.APPROVED
                          }
                        >
                          {error ?? `Confirm Adding Liquidity`}
                        </Button>
                      )}
                  </AutoColumn>
                )
              )}
            </div>

            {pair && !noLiquidity && pairState !== PairState.INVALID ? (
              <MinimalPositionCard
                showUnwrapped={oneCurrencyIsWETH}
                pair={pair}
              />
            ) : null}
          </div>
        </DoubleGlowShadow>
      </Container>
    </>
  );
}
