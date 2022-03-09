import { Popover as HeadlessuiPopover } from "@headlessui/react";
import { Placement } from "@popperjs/core";
import React, { Fragment } from "react";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import useInterval from "../../hooks/util/useInterval";
import { classNames } from "../../utils/classNames";

export interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  show?: boolean;
  modifiers?: any[];
  fullWidth?: boolean;
}

export default function Popover({
  content,
  children,
  placement = "auto",
  show,
  modifiers,
}: PopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, update, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
      strategy: "fixed",
      modifiers: modifiers || [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "arrow", options: { element: arrowElement } },
      ],
    }
  );

  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);

  useInterval(updateCallback, show ? 100 : null);

  return (
    <HeadlessuiPopover as={Fragment}>
      {({ open }) => (
        <>
          {React.Children.map(children, (child) => {
            return (
              <HeadlessuiPopover.Button
                as={Fragment}
                {...{ ref: setReferenceElement as any }}
              >
                {child}
              </HeadlessuiPopover.Button>
            );
          })}
          {(show ?? open) &&
            ReactDOM.createPortal(
              <HeadlessuiPopover.Panel
                static
                className="z-1000 shadow-xl shadow-taupe-500/80 rounded overflow-hidden"
                ref={setPopperElement as any}
                style={styles.popper}
                {...attributes.popper}
              >
                {content}
                <div
                  className={classNames("w-2 h-2 z-50")}
                  ref={setArrowElement as any}
                  style={styles.arrow}
                  {...attributes.arrow}
                />
              </HeadlessuiPopover.Panel>,

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              document.querySelector("#popover-portal")
            )}
        </>
      )}
    </HeadlessuiPopover>
  );
}
