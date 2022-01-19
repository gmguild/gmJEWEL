import React from "react";
import { classNames } from "../utils/classNames";

export interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function Button({
  children,
  onClick,
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={
        classNames(
          "w-auto flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium whitespace-nowrap rounded-md md:text-md",
          disabled ? "text-gray-300 bg-gray-500 cursor-not-allowed" : "text-white bg-rune cursor-pointer",
          className,
        )
      }
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
