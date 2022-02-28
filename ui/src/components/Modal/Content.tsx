import React, { FC, HTMLProps } from "react";
import { classNames } from "../../utils/classNames";

export interface ModalContentProps {
  className?: string;
}

const ModalContent: FC<ModalContentProps> = ({ children, className = "" }) => {
  return <div className={classNames("", className)}>{children}</div>;
};

export interface ModalContentBorderedProps extends HTMLProps<HTMLDivElement> {
  className?: string;
}

export const BorderedModalContent: FC<ModalContentBorderedProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={classNames(
        className,
        "border border-taupe-300/60 rounded p-4"
      )}
    >
      {children}
    </div>
  );
};

export default ModalContent;
