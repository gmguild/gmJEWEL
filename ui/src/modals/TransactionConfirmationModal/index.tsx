import Lottie from "lottie-react";
import React from "react";
import { FC } from "react";
import Button from "../../components/Button";
import ExternalLink from "../../components/ExternalLink";
import HeadlessUiModal from "../../components/Modal/HeadlessUIModal";
import Typography from "../../components/Typography";
import { getExplorerLink } from "../../functions/explorer";
import { ChainId, Currency } from "../../package";
import { useActiveWeb3React } from "../../services/web3";
import loadingRollingCircle from "../../animation/loading-rolling-circle.json";
import receiptPrinting from "../../animation/receipt-printing.json";
import useAddTokenToMetaMask from "../../hooks/useAddTokenToMetaMask";

interface ConfirmationPendingContentProps {
  onDismiss: () => void;
  pendingText: string;
}

export const ConfirmationPendingContent: FC<
  ConfirmationPendingContentProps
> = ({ onDismiss, pendingText }) => {
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header
        header={`Confirm transaction`}
        onClose={onDismiss}
      />
      <HeadlessUiModal.BorderedContent className="flex flex-col items-center justify-center gap-1">
        <div className="w-16 py-8 m-auto">
          <Lottie animationData={loadingRollingCircle} autoplay loop />
        </div>
        <Typography variant="lg" weight={700} className="text-white">
          {pendingText}
        </Typography>
        <Typography variant="sm">
          {`Confirm this transaction in your wallet`}
        </Typography>
      </HeadlessUiModal.BorderedContent>
    </div>
  );
};

interface TransactionSubmittedContentProps {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined;
  inline?: boolean; // not in modal
}

export const TransactionSubmittedContent: FC<
  TransactionSubmittedContentProps
> = ({ onDismiss, chainId, hash, currencyToAdd }) => {
  const { library } = useActiveWeb3React();
  const { addToken, success } = useAddTokenToMetaMask(currencyToAdd);
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header
        header={`Transaction submitted`}
        onClose={onDismiss}
      />
      <HeadlessUiModal.BorderedContent className="flex flex-col items-center justify-center gap-1">
        <div className="w-[102px] h-[102px] bg-taupe-400 rounded-full">
          <Lottie animationData={receiptPrinting} autoplay loop={false} />
        </div>
        <Typography
          id="text-transaction-submitted"
          variant="sm"
          weight={700}
          className="text-white"
        >
          {`Transaction Submitted`}
        </Typography>
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, "transaction")}>
            <Typography
              variant="xs"
              weight={700}
              className="outline-none text-blue"
            >
              {`View on explorer`}
            </Typography>
          </ExternalLink>
        )}
      </HeadlessUiModal.BorderedContent>

      {currencyToAdd && library?.provider?.isMetaMask && (
        <Button color="blue" onClick={!success ? addToken : onDismiss}>
          <Typography variant="sm" weight={700}>
            {!success ? `Add ${currencyToAdd.symbol} to MetaMask` : `Dismiss`}
          </Typography>
        </Button>
      )}
    </div>
  );
};

interface ConfirmationModelContentProps {
  title: string;
  onDismiss: () => void;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={title} onClose={onDismiss} />
      {topContent}
      {bottomContent}
    </div>
  );
};

interface TransactionErrorContentProps {
  message: string;
  onDismiss: () => void;
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({
  message,
  onDismiss,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header
        header={`Transaction Rejected`}
        onClose={onDismiss}
      />
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-1 text-center">
        <Typography
          variant="lg"
          weight={700}
          className="text-pink-red"
          component="span"
        >
          {`Oops!`}
        </Typography>
        <Typography
          variant="sm"
          weight={700}
          className="text-primary"
          component="span"
        >
          {message}
        </Typography>
      </HeadlessUiModal.BorderedContent>
      <Button color="blue" onClick={onDismiss}>
        {`Dismiss`}
      </Button>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash?: string;
  content: React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  currencyToAdd?: Currency;
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React();
  if (!chainId) return <></>;

  return (
    <HeadlessUiModal.Controlled
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="md"
      unmount={false}
    >
      {attemptingTxn ? (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText={pendingText}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content
      )}
    </HeadlessUiModal.Controlled>
  );
};

export default TransactionConfirmationModal;
