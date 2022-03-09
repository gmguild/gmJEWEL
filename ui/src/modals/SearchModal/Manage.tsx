import React from "react";
import { FC, useState } from "react";
import HeadlessUiModal from "../../components/Modal/HeadlessUIModal";
import Typography from "../../components/Typography";
import { classNames } from "../../utils/classNames";
import CurrencyModalView from "./CurrencyModalView";
import { useCurrencyModalContext } from "./CurrencySearchModal";
import ManageLists from "./ManageLists";
import ManageTokens from "./ManageTokens";

const Manage: FC = () => {
  const { setView, onDismiss } = useCurrencyModalContext();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <HeadlessUiModal.Header
        header={`Manage`}
        onClose={onDismiss}
        onBack={() => setView(CurrencyModalView.search)}
      />
      <div className="flex rounded border border-taupe-300 hover:border-taupe-200">
        {[`Lists`, `Tokens`].map((title, i) => (
          <div
            key={i}
            className={classNames(
              tabIndex === i
                ? "text-high-emphesis border-blue"
                : "border-transparent",
              "flex items-center justify-center flex-1 px-1 py-3 rounded cursor-pointer select-none border bg-[rgba(0,0,0,0.2)]"
            )}
            onClick={() => setTabIndex(i)}
          >
            <Typography
              weight={700}
              className={classNames(
                tabIndex === i ? "text-primary" : "text-secondary",
                "hover:text-high-emphesis focus:outline-none"
              )}
            >
              {title}
            </Typography>
          </div>
        ))}
      </div>
      {tabIndex === 0 && <ManageLists />}
      {tabIndex === 1 && <ManageTokens />}
    </>
  );
};

export default Manage;
