import React, { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { Trash } from "react-feather";
import Button from "../../components/Button";
import { CurrencyLogo } from "../../components/CurrencyLogo";
import ExternalLink from "../../components/ExternalLink";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import HeadlessUiModal from "../../components/Modal/HeadlessUIModal";
import Typography from "../../components/Typography";
import { getExplorerLink } from "../../functions/explorer";
import { useToken } from "../../hooks/token/tokens";
import { useActiveWeb3React } from "../../services/web3";
import {
  useRemoveUserAddedToken,
  useUserAddedTokens,
} from "../../state/user/hooks";
import { classNames } from "../../utils/classNames";
import { isAddress } from "../../utils/conversion";
import CurrencyModalView from "./CurrencyModalView";
import { useCurrencyModalContext } from "./CurrencySearchModal";
import ImportRow from "./ImportRow";

const ManageTokens: FC = () => {
  const { setView, setImportToken } = useCurrencyModalContext();
  const { chainId } = useActiveWeb3React();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // manage focus on modal show
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checkSum = isAddress(input);
    setSearchQuery(checkSum || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  // all tokens for local list
  const userAddedTokens = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <div
          className="flex justify-between px-4 py-3 hover:bg-dark-800/40"
          key={token.address}
        >
          <div className="flex items-center gap-3">
            <CurrencyLogo
              currency={token}
              size={32}
              className="!rounded-full overflow-hidden"
            />
            <ExternalLink
              href={getExplorerLink(chainId, token.address, "address")}
            >
              <Typography weight={700}>{token.symbol}</Typography>
            </ExternalLink>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center w-4 h-4 cursor-pointer hover:text-white"
              onClick={() => removeToken(chainId, token.address)}
            >
              <Trash width={20} />
            </div>
            <ExternalLinkIcon
              className="flex items-center cursor-pointer min-w-4 min-h-4 hover:text-white"
              href={getExplorerLink(chainId, token.address, "address")}
            />
          </div>
        </div>
      ))
    );
  }, [userAddedTokens, chainId, removeToken]);

  const handleImport = useCallback(() => {
    if (searchToken) {
      setImportToken(searchToken);
    }

    setView(CurrencyModalView.importToken);
  }, [searchToken, setImportToken, setView]);

  return (
    <>
      <input
        id="token-search-input"
        type="text"
        placeholder="0x..."
        className={classNames(
          searchQuery !== "" && !isAddressSearch
            ? "border-red"
            : "border-dark-800 focus:border-blue",
          "w-full bg-[rgba(0,0,0,0.2)] border rounded placeholder-secondary font-bold text-base p-4 appearance-none"
        )}
        value={searchQuery}
        autoComplete="off"
        onChange={handleInput}
        autoCorrect="off"
      />
      {searchToken && <ImportRow token={searchToken} onClick={handleImport} />}
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-[rgba(0,0,0,0.2)] !p-0">
        <div className="flex items-center justify-between p-4">
          <Typography variant="xs" weight={700} className="text-secondary">
            {userAddedTokens?.length} Custom{" "}
            {userAddedTokens.length === 1 ? "Token" : "Tokens"}
          </Typography>
          <Button
            variant="outlined"
            color="blue"
            size="xs"
            onClick={handleRemoveAll}
          >
            {`Clear all`}
          </Button>
        </div>
        <div className="divide-y divide-dark-800">{tokenList}</div>
      </HeadlessUiModal.BorderedContent>
      <div className="flex flex-grow h-full" />
      <Typography
        variant="xs"
        weight={700}
        className="text-center text-secondary"
      >
        {`Custom tokens are stored locally in your browser`}
      </Typography>
    </>
  );
};

export default ManageTokens;
