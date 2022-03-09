/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import { Switch as HeadlessUiSwitch } from "@headlessui/react";
import { ComponentProps, FC, ReactNode } from "react";
import { classNames } from "../../utils/classNames";

type SwitchColor = "default" | "gradient";

type SwitchProps = ComponentProps<typeof HeadlessUiSwitch> & {
  size?: "xs" | "sm" | "md";
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  color?: SwitchColor;
  id?: string;
};

const COLOR = {
  // @ts-ignore TYPE NEEDS FIXING
  default: (checked) => (checked ? "bg-high-emphesis" : "bg-high-emphesis"),
  // @ts-ignore TYPE NEEDS FIXING
  gradient: (checked) =>
    checked ? "bg-gradient-to-r from-blue to-pink" : "bg-taupe-700",
};

const HEIGHT = {
  xs: 20,
  sm: 28,
  md: 36,
};

const WIDTH = {
  xs: 53,
  sm: 57,
  md: 65,
};

const Switch: FC<SwitchProps> = ({
  size = "md",
  checked,
  onChange,
  checkedIcon = "",
  uncheckedIcon = "",
  color = "default",
  id = "",
}: SwitchProps) => {
  // @ts-ignore
  const height = HEIGHT[size];
  //   @ts-ignore
  const width = WIDTH[size];

  return (
    <HeadlessUiSwitch
      checked={checked}
      onChange={onChange}
      className={classNames(
        `flex items-center bg-taupe-800 border border-taupe-700 relative inline-flex flex-shrink-0 rounded-full cursor-pointer ease-in-out duration-200 ${id}`
      )}
      style={{ height, width }}
    >
      <span
        id={id}
        className={classNames(
          checked ? "translate-x-[30px]" : "translate-x-[2px]",
          COLOR[color](checked),
          `transition-colors transition-transform pointer-events-none p-1 rounded-full shadow-md ease-in-out duration-200 inline-flex items-center justify-center`
        )}
        style={{
          height: height - 6,
          width: height - 6,
          transform: `translate(${checked ? 30 : 2}, 0)`,
        }}
      >
        {checked ? checkedIcon : uncheckedIcon}
      </span>
    </HeadlessUiSwitch>
  );
};

export default Switch;
