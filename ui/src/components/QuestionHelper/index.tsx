import { InformationCircleIcon } from "@heroicons/react/outline";
import React, { useCallback, useRef, useState } from "react";
import { FC, ReactElement, ReactNode } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import useToggle from "../../hooks/useToggle";
import { classNames } from "../../utils/classNames";
import Tooltip from "../Tooltip";

const QuestionHelper: FC<{
  text?: any;
  icon?: ReactNode;
  children?: ReactElement;
  className?: string;
}> = ({
  className,
  children,
  text,
  icon = <InformationCircleIcon width={14} height={14} />,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [toggle, setToggle] = useToggle(false);
  const node = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(node, toggle ? setToggle : undefined);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  if (children) {
    return (
      <Tooltip text={text} show={show || toggle} className={className}>
        {React.cloneElement(children, {
          ref: node,
          onClick: setToggle,
          className: classNames(
            children.props.className,
            "flex items-center justify-center w-full outline-none"
          ),
          onMouseEnter: open,
          onMouseLeave: close,
        })}
      </Tooltip>
    );
  }

  return (
    <Tooltip text={text} show={show || toggle} className={className}>
      <div
        ref={node}
        onClick={setToggle}
        className="flex items-center justify-center ml-1 outline-none cursor-help hover:text-primary"
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

export default QuestionHelper;
