/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { classNames } from "../../utils/classNames";

interface DotsProps {
  children?: any;
  className?: string;
}

export default function Dots({ children = <span />, className }: DotsProps) {
  return (
    <>
      <span
        className={classNames(
          "after:inline-block dots after:animate-ellipsis after:w-4 after:text-left",
          className
        )}
      >
        {children}
      </span>
    </>
  );
}
