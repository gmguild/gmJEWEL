import React from "react";
import { AlertCircle, CheckCircle } from "react-feather";
import { getExplorerLink } from "../../functions/explorer";
import { useActiveWeb3React } from "../../services/web3";
import ExternalLink from "../ExternalLink";
import { ExternalLinkIcon } from "../ExternalLinkIcon";

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string;
  success?: boolean;
  summary?: string;
}) {
  const { chainId } = useActiveWeb3React();
  const explorerLink = getExplorerLink(chainId, hash, "transaction");

  return (
    <div className="flex flex-row w-full flex-nowrap z-[1000]">
      <div className="pr-4">
        {success ? (
          <CheckCircle className="text-2xl text-green" />
        ) : (
          <AlertCircle className="text-2xl text-red" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold text-high-emphesis">
          {summary ?? "Hash: " + hash.slice(0, 8) + "..." + hash.slice(58, 65)}
        </div>
        {chainId && hash && (
          <ExternalLink
            className="p-0 text-blue hover:underline md:p-0"
            href={explorerLink}
          >
            <div className="flex flex-row items-center gap-1">
              View on explorer{" "}
              <ExternalLinkIcon href={explorerLink} width={20} height={20} />
            </div>
          </ExternalLink>
        )}
      </div>
    </div>
  );
}
