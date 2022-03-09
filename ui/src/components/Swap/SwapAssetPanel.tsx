import { ChevronDownIcon } from "@heroicons/react/outline";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { tryParseAmount } from "../../functions/parse";
import { warningSeverity } from "../../functions/prices";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import CurrencySearchModal from "../../modals/SearchModal/CurrencySearchModal";
import { Currency, Percent, ZERO } from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { classNames } from "../../utils/classNames";
import Button from "../Button";
import { CurrencyLogo } from "../CurrencyLogo";
import QuestionHelper from "../QuestionHelper";
import Typography from "../Typography";
import NumericalInput from "../../components/Input/Numeric";
import { formatNumber } from "../../functions/format";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { maxAmountSpend } from "../../functions/currency";

/* eslint-disable @typescript-eslint/ban-ts-comment */
interface SwapAssetPanel {
  error?: boolean;
  // @ts-ignore TYPE NEEDS FIXING
  header: (x) => React.ReactNode;
  // @ts-ignore TYPE NEEDS FIXING
  walletToggle?: (x) => React.ReactNode;
  currency?: Currency;
  currencies?: string[];
  value?: string;
  onChange(x?: string): void;
  onSelect?(x: Currency): void;
  spendFromWallet?: boolean;
  selected?: boolean;
  priceImpact?: Percent;
  priceImpactCss?: string;
  disabled?: boolean;
}

const SwapAssetPanel = ({
  error,
  header,
  walletToggle,
  currency,
  value,
  onChange,
  selected,
  onSelect,
  spendFromWallet,
  priceImpact,
  priceImpactCss,
  disabled,
  currencies,
}: SwapAssetPanel) => {
  return (
    <div className="rounded-[14px] border border-dark-700 hover:border-dark-600 bg-dark-900 p-3 flex flex-col gap-4">
      {header({
        disabled,
        onChange,
        value,
        currency,
        currencies,
        onSelect,
        walletToggle,
        spendFromWallet,
      })}
      <div className="flex gap-1 justify-between items-baseline px-1.5">
        <InputPanel
          {...{
            selected,
            error,
            currency,
            currencies,
            value,
            onChange,
            disabled,
            onSelect,
            priceImpact,
            priceImpactCss,
            spendFromWallet,
          }}
        />
        <BalancePanel {...{ disabled, currency, onChange, spendFromWallet }} />
      </div>
    </div>
  );
};

const WalletSwitch: FC<
  Pick<SwapAssetPanel, "spendFromWallet" | "disabled"> & {
    label: string;
    onChange(x: boolean): void;
    id?: string;
  }
> = ({ label, onChange, id, spendFromWallet, disabled }) => {
  const content = (
    <Typography
      variant="xs"
      weight={700}
      component="span"
      className={classNames(
        disabled ? "pointer-events-none opacity-40" : "",
        "flex items-center gap-2 !justify-end"
      )}
    >
      {label}
      <Typography
        id={id}
        role="button"
        onClick={() => onChange(!spendFromWallet)}
        variant="sm"
        weight={700}
        component="span"
        className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer text-high-emphesis hover:text-white hover:shadow bg-dark-800 hover:bg-dark-700"
      >
        Wallet
      </Typography>
    </Typography>
  );

  if (disabled) {
    return (
      <QuestionHelper text={`Not available for legacy route`}>
        {content}
      </QuestionHelper>
    );
  }

  return content;
};

const InputPanel: FC<
  Pick<
    SwapAssetPanel,
    "currency" | "value" | "onChange" | "disabled" | "priceImpact"
  > & { priceImpactCss?: string }
> = ({ currency, value, onChange, disabled, priceImpact, priceImpactCss }) => {
  const usdcValue = useUSDCValue(tryParseAmount(value || "1", currency));
  const span = useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState(0);

  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan("0")) return "text-green";
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return "text-green";
    if (severity < 2) return "text-yellow";
    if (severity < 3) return "text-red";
    return "text-red";
  }, [priceImpact]);

  useEffect(() => {
    if (span.current) {
      setWidth(value ? span?.current?.clientWidth + 8 : 60);
    }
  }, [value]);

  return (
    <Typography
      weight={700}
      variant="h3"
      className="relative flex items-baseline flex-grow gap-3 overflow-hidden"
    >
      <NumericalInput
        disabled={disabled}
        value={value || ""}
        onUserInput={onChange}
        placeholder="0.00"
        className="leading-[36px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
        autoFocus
      />
      <Typography
        variant="xs"
        className="text-secondary absolute bottom-1.5 pointer-events-none"
        component="span"
        style={{ left: width }}
      >
        {usdcValue?.greaterThan(ZERO) && (
          <>~{formatNumber(usdcValue?.toFixed(), true, true, 2)} </>
        )}
        {priceImpact && (
          <span className={priceImpactCss || priceImpactClassName}>
            ({priceImpact?.toSignificant(2)}%)
          </span>
        )}
      </Typography>
      {/*This acts as a reference to get input width*/}
      <Typography
        variant="h3"
        weight={700}
        className="relative flex flex-row items-baseline"
      >
        <span
          ref={span}
          className="opacity-0 absolute pointer-events-none tracking-[0]"
        >
          {`${value ? value : "0.00"}`}
        </span>
      </Typography>
    </Typography>
  );
};

const BalancePanel: FC<
  Pick<SwapAssetPanel, "disabled" | "currency" | "onChange" | "spendFromWallet">
> = ({ disabled, currency, onChange, spendFromWallet }) => {
  const { account } = useActiveWeb3React();
  const balance = useCurrencyBalance(account ? account : undefined, currency);

  const handleClick = useCallback(() => {
    if (disabled || !balance || !onChange) return;
    onChange(maxAmountSpend(balance)?.toExact());
  }, [balance, disabled, onChange]);

  return (
    <Typography
      role="button"
      onClick={handleClick}
      variant="sm"
      className="flex text-secondary whitespace-nowrap"
    >
      {`Balance:`} {balance ? balance.toSignificant(6) : "0.00"}
    </Typography>
  );
};

const SwapAssetPanelHeader: FC<
  Pick<
    SwapAssetPanel,
    | "currency"
    | "currencies"
    | "onSelect"
    | "walletToggle"
    | "spendFromWallet"
    | "disabled"
    | "onChange"
    | "value"
  > & { label: string; id?: string }
> = ({ walletToggle, currency, onSelect, spendFromWallet, id, currencies }) => {
  const trigger = currency ? (
    <div
      id={id}
      className="flex items-center gap-2 px-2 py-1 rounded-full shadow-md cursor-pointer text-high-emphesis bg-dark-800 hover:bg-dark-700"
    >
      <CurrencyLogo
        currency={currency}
        className="!rounded-full overflow-hidden"
        size={20}
      />
      <Typography variant="sm" className="!text-xl" weight={700}>
        {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
      </Typography>
      <ChevronDownIcon width={18} />
    </div>
  ) : (
    <Button
      color="blue"
      variant="filled"
      size="sm"
      id={id}
      className="!rounded-full !px-2 !py-0 !h-[32px] !pl-3"
    >
      {`Select a Token`}
      <ChevronDownIcon width={18} />
    </Button>
  );

  return (
    <div className="flex items-end justify-between gap-2">
      <CurrencySearchModal
        selectedCurrency={currency}
        onCurrencySelect={(currency) => onSelect && onSelect(currency)}
        trigger={trigger}
        currencyList={currencies}
      />
      {walletToggle && walletToggle({ spendFromWallet })}
    </div>
  );
};

SwapAssetPanel.Header = SwapAssetPanelHeader;
SwapAssetPanel.Switch = WalletSwitch;

export default SwapAssetPanel;
