// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import React from "react";
import { FC } from "react";
import { useLocation } from "react-router";
import { currencyId } from "../../functions/currencyId";
import { Currency, Percent } from "../../package";
import NavLink from "../NavLink";
import Settings from "../Settings";

interface ExchangeHeaderProps {
  input?: Currency;
  output?: Currency;
  allowedSlippage?: Percent;
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({
  input,
  output,
  allowedSlippage,
}) => {
  const asPath = useLocation().pathname;
  const isRemove = asPath.startsWith("/remove");

  return (
    <div className="flex items-center justify-between mb-4 space-x-3">
      <div className="flex rounded bg-taupe-300 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-taupe-300 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          href={`/${!isRemove ? "add" : "remove"}${
            input ? `/${currencyId(input)}` : ""
          }${output ? `/${currencyId(output)}` : ""}`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {`Liquidity`}
          </a>
        </NavLink>
      </div>
      <div className="flex items-center">
        <div className="grid grid-flow-col gap-1">
          <div className="relative flex items-center w-full h-full rounded hover:bg-taupe-300">
            <Settings placeholderSlippage={allowedSlippage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeHeader;
