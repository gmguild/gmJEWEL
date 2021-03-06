/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { FC, ReactNode } from "react";
import { classNames } from "../../utils/classNames";
import Dots from "../Dots";
import Loader from "../Loader";

export type ButtonColor =
  | "red"
  | "blue"
  | "pink"
  | "purple"
  | "gradient"
  | "gray"
  | "yellow";
export type ButtonSize = "xs" | "sm" | "lg" | "default" | "none";
export type ButtonVariant = "outlined" | "filled" | "empty";

const DIMENSIONS: { xs: string; sm: string; md: string; lg: string } = {
  xs: "px-2 h-[28px] !border",
  sm: "px-3 h-[36px]",
  md: "px-4 h-[52px]",
  lg: "px-6 h-[60px]",
};

const SIZE: { xs: string; sm: string; md: string; lg: string } = {
  xs: "text-xs rounded",
  sm: "text-sm rounded",
  md: "rounded",
  lg: "text-lg rounded",
};

const FILLED = {
  default:
    "text-black hover:bg-gradient-to-b hover:from-black/20 focus:to-black/20 focus:bg-gradient-to-b focus:from-black/20 hover:to-black/20 active:bg-gradient-to-b active:from-black/40 active:to-black/40 disabled:pointer-events-none disabled:opacity-40",
  blue: "bg-blue",
  red: "bg-red",
  pink: "bg-pink",
  purple: "bg-purple",
  gradient:
    "!bg-gradient-to-r from-white to-yellow-600 hover:from-white/80 hover:to-yellow-600/80 focus:from-white/80 focus:to-yellow-600/80 active:from-white/70 active:to-yellow-600/70 focus:border-blue-700",
  gray: "bg-taupe-200",
  yellow: "bg-yellow",
};

const OUTLINED = {
  default: "border-2 disabled:pointer-events-none disabled:opacity-40",
  blue: "border-blue hover:bg-blue/10 active:bg-blue/20 text-blue focus:bg-blue/10",
  red: "border-red hover:bg-red/10 active:bg-red/20 text-red focus:bg-red/10",
  pink: "border-pink hover:bg-pink/10 active:bg-pink/20 text-pink focus:bg-pink/10",
  purple:
    "border-purple hover:bg-purple/10 active:bg-purple/20 text-purple focus:bg-purple/10",
  gradient:
    "border-purple hover:bg-purple/10 active:bg-purple/20 text-purple focus:bg-purple/10",
  gray: "border-taupe-200 hover:bg-taupe-200/30 active:bg-taupe-200/50 focus:bg-taupe-200/30",
  yellow:
    "border-yellow hover:bg-yellow/10 active:bg-yellow/20 text-yellow focus:bg-yellow/10",
};

const EMPTY = {
  default:
    "bg-transparent hover:brightness-[90%] focus:brightness-[90%] active:brightness-[80%] disabled:pointer-events-none disabled:opacity-40",
  blue: "text-blue",
  red: "text-red",
  pink: "text-pink",
  purple: "text-purple",
  gray: "text-higher-emphesis",
  gradient:
    "!bg-gradient-to-r from-white to-yellow-600 hover:from-white/80 hover:to-yellow-600/80 focus:from-white/80 focus:to-yellow-600/80 active:from-white/70 active:to-yellow-600/70",
  yellow: "text-yellow",
};

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
};

type Button = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> & {
  Dotted: FC<DottedButtonProps>;
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      color = "yellow",
      size = "md",
      variant = "filled",
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          VARIANT[variant]["default"],
          VARIANT[variant][color],
          // @ts-ignore
          SIZE[size],
          // @ts-ignore
          variant !== "empty" ? DIMENSIONS[size] : "",
          fullWidth ? "w-full" : "",
          "font-bold flex items-center justify-center gap-1",
          className
        )}
        {...rest}
      >
        {loading ? (
          <Loader stroke="currentColor" />
        ) : (
          <>
            {startIcon && startIcon}
            {children}
            {endIcon && endIcon}
          </>
        )}
      </button>
    );
  }
);

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean;
  disabled?: boolean;
} & ButtonProps) {
  if (error) {
    return <Button color="red" size="lg" disabled={disabled} {...rest} />;
  } else {
    return <Button color="gradient" disabled={disabled} size="lg" {...rest} />;
  }
}

interface DottedButtonProps extends ButtonProps {
  pending: boolean;
}

export const ButtonDotted: FC<DottedButtonProps> = ({
  pending,
  children,
  ...rest
}) => {
  const buttonText = pending ? <Dots>{children}</Dots> : children;
  return (
    <Button {...rest} {...(pending && { disabled: true })}>
      {buttonText}
    </Button>
  );
};

export default Button;
