import React, { FC } from "react";
import { classNames } from "../../utils/classNames";

export interface ModalActionErrorProps {
  className?: string;
}

const ModalError: FC<ModalActionErrorProps> = ({
  className = "",
  children,
}) => {
  if (!children) return <></>;

  return (
    <Typography
      variant="xs"
      weight={700}
      className={classNames("text-center text-red", className)}
    >
      {children}
    </Typography>
  );
};

export default ModalError;
