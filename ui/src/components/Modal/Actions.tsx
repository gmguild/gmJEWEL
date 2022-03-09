import React, { FC } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModalActionsProps {}

const ModalActions: FC<ModalActionsProps> = ({ children }) => {
  return <div className="flex justify-end gap-4 items-center">{children}</div>;
};

export default ModalActions;
