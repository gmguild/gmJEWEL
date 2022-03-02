/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { FC } from "react";
import { Currency } from "../../package";
import NavLink from "../NavLink";
import Settings from "../Settings";
import Typography from "../Typography";

const getQuery = (input?: Currency, output?: Currency) => {
  if (!input && !output) return;

  if (input && !output) {
    //   @ts-ignore
    return { inputCurrency: input.address || "ETH" };
  } else if (input && output) {
    //   @ts-ignore
    return { inputCurrency: input.address, outputCurrency: output.address };
  }
};

interface HeaderNewProps {
  inputCurrency?: Currency;
  outputCurrency?: Currency;
}

const HeaderNew: FC<HeaderNewProps> = ({ inputCurrency, outputCurrency }) => {
  return (
    <div className="flex items-center justify-between gap-1">
      <div className="flex gap-4">
        <Typography weight={700} className="text-white">
          Swap
        </Typography>
      </div>
      <div className="flex gap-4">
        <Settings className="!w-6 !h-6" />
      </div>
    </div>
  );
};

export default HeaderNew;
