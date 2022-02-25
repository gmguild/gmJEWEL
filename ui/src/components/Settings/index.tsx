import { CheckIcon, CogIcon } from "@heroicons/react/outline";
import React, { FC, useState } from "react";
import { Percent } from "../../package";
import { useToggleSettingsMenu } from "../../state/application/hooks";
import {
  useExpertModeManager,
  useUserSingleHopOnly,
} from "../../state/user/hooks";
import { classNames } from "../../utils/classNames";
import Button from "../Button";
import CloseIcon from "../CloseIcon";
import HeadlessUiModal from "../Modal/HeadlessUIModal";
import Popover from "../Popover";
import QuestionHelper from "../QuestionHelper";
import Switch from "../Switch";
import TransactionSettings from "../TransactionSettings";
import Typography from "../Typography";

interface SettingsTabProps {
  placeholderSlippage?: Percent;
  trident?: boolean;
  className?: string;
}

const SettingsTab: FC<SettingsTabProps> = ({
  placeholderSlippage,
  className,
  trident = false,
}) => {
  const toggle = useToggleSettingsMenu();
  const [expertMode, toggleExpertMode] = useExpertModeManager();
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly();
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <Popover
        placement="bottom-end"
        content={
          <div className="flex flex-col gap-3 p-3 border rounded shadow-xl bg-dark-900 w-80 border-dark-700">
            <div className="flex flex-col gap-4 p-3 border rounded border-dark-800/60">
              <Typography variant="xxs" weight={700} className="text-secondary">
                {`Transaction Settings`}
              </Typography>
              <TransactionSettings
                placeholderSlippage={placeholderSlippage}
                trident={trident}
              />
            </div>
            <div className="flex flex-col gap-3 p-3 border rounded border-dark-800/60">
              <Typography variant="xxs" weight={700} className="text-secondary">
                {`Interface Settings`}
              </Typography>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography
                    variant="xs"
                    className="text-high-emphesis"
                    weight={700}
                  >
                    {`Toggle expert mode`}
                  </Typography>
                  <QuestionHelper
                    text={`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`}
                  />
                </div>
                <Switch
                  size="sm"
                  id="toggle-expert-mode-button"
                  checked={expertMode}
                  onChange={
                    expertMode
                      ? () => {
                          toggleExpertMode();
                          setShowConfirmation(false);
                        }
                      : () => {
                          toggle();
                          setShowConfirmation(true);
                        }
                  }
                  checkedIcon={<CheckIcon className="text-dark-700" />}
                  uncheckedIcon={<CloseIcon />}
                  color="gradient"
                />
              </div>
              {!trident && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Typography
                      variant="xs"
                      className="text-high-emphesis"
                      weight={700}
                    >
                      {`Disable multihops`}
                    </Typography>
                    <QuestionHelper
                      text={`Restricts swaps to direct pairs only.`}
                    />
                  </div>
                  <Switch
                    size="sm"
                    id="toggle-disable-multihop-button"
                    checked={singleHopOnly}
                    onChange={() =>
                      singleHopOnly
                        ? setSingleHopOnly(false)
                        : setSingleHopOnly(true)
                    }
                    checkedIcon={<CheckIcon className="text-dark-700" />}
                    uncheckedIcon={<CloseIcon />}
                    color="gradient"
                  />
                </div>
              )}
            </div>
          </div>
        }
      >
        <div
          className={classNames(
            className,
            "flex items-center justify-center w-10 h-10 rounded-full cursor-pointer"
          )}
        >
          <CogIcon className="w-[26px] h-[26px] transform rotate-90 hover:text-white" />
        </div>
      </Popover>
      <HeadlessUiModal.Controlled
        isOpen={showConfirmation}
        onDismiss={() => setShowConfirmation(false)}
        maxWidth="md"
      >
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header
            header={`Confirm`}
            onClose={() => setShowConfirmation(false)}
          />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-3 !border-yellow/40">
            <Typography variant="xs" weight={700} className="text-secondary">
              {`Only use this mode if you know what you are doing.`}
            </Typography>
            <Typography variant="sm" weight={700} className="text-yellow">
              {`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                  that often result in bad rates and lost funds.`}
            </Typography>
          </HeadlessUiModal.BorderedContent>
          <Button
            id="confirm-expert-mode"
            color="blue"
            variant="filled"
            onClick={() => {
              toggleExpertMode();
              setShowConfirmation(false);
            }}
          >
            {`Enable Expert Mode`}
          </Button>
        </div>
      </HeadlessUiModal.Controlled>
    </>
  );
};

export default SettingsTab;
