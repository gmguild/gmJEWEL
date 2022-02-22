import React from "react";
import { FC } from "react";
import Typography from "../../components/Typography";
import { COMMON_BASES } from "../../config/routing";
import { Currency } from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import { useCurrencyModalContext } from "./CurrencySearchModal";

const CommonBases: FC = () => {
  const { chainId } = useActiveWeb3React();
  const { currency: selectedCurrency, onSelect } = useCurrencyModalContext();
  const bases =
    typeof chainId !== "undefined" ? COMMON_BASES[chainId] ?? [] : [];

  if (bases.length === 0) return <></>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row">
        <Typography
          variant="xs"
          weight={700}
          className="flex items-center text-low-emphesis"
        >
          {`Common bases`}
          <QuestionHelper text="These tokens are commonly paired with other tokens." />
        </Typography>
      </div>
      <div className="flex flex-wrap gap-2">
        {bases.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency);
          return (
            <Button
              size="sm"
              variant="outlined"
              color="gray"
              type="button"
              onClick={() => !isSelected && onSelect(currency)}
              disabled={isSelected}
              key={currencyId(currency)}
              className="!border !px-2 flex gap-2"
            >
              <CurrencyLogo currency={currency} size={18} />
              <Typography variant="sm" className="font-semibold">
                {currency.symbol}
              </Typography>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CommonBases;
