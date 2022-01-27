import React from "react";
import { useAccount, useBlockNumber, useConnect } from "wagmi";
import { classNames } from "../utils/classNames";
import { shortenAddress } from "../utils/conversion";
import { Link, useLocation } from "react-router-dom";
import { MarketSounds } from "./MarketSounds";
import { usePrices } from "../hooks/token/usePrices";
import { useGetLastScannedBlock } from "../hooks/util/useGetLastScannedBlock";

export const Header = () => {
  const [lastScannedBlock] = useGetLastScannedBlock();
  const [{ data: currentBlockNumber }] = useBlockNumber({ watch: true });
  const indexerIsBehind = lastScannedBlock && currentBlockNumber && currentBlockNumber - lastScannedBlock > 30; // 1 minute of blocks

  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [prices, loadingPrices] = usePrices();

  return (
    <div className="max-w-5xl mx-auto">
      <section className={classNames("flex-1 flex flex-col")}>
        <div
          className={classNames(
            "px-4 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between bg-white border-b-2"
          )}
        >
          <div className={classNames("flex flex-col items-center text-center hidden sm:block sm:-ml-4")}>
            <a className="text-xs block my-1 mx-2 underline text-gray-700 hover:text-blue-600" href="https://twitter.com/gmguild69" target="_blank" rel="noreferrer">
              Twitter
            </a>
            <a className="text-xs block my-1 mx-2 underline text-gray-700 hover:text-blue-600" href="https://discord.gg/7EKz446t4F" target="_blank" rel="noreferrer">
              Discord
            </a>
            <a className="text-xs block my-1 mx-2 underline text-gray-700 hover:text-blue-600" href="https://github.com/gmguild/gmJEWEL" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>

          <div className="flex flex-col items-center">
            <h1 className={classNames("text-lg md:text-2xl my-2 text-gray-700 text-center")}>
              Greedy Merchants Guild
            </h1>

            <div className="flex flex-row flex-wrap items-center justify-center text-sm space-x-2 my-2">
              <a className="block cursor-pointer" href="https://dexscreener.com/harmony/0xa1221a5bbea699f507cc00bdedea05b5d2e32eba" target="_blank" rel="noreferrer"><span className="text-gray-500">$JEWEL</span> {loadingPrices ? '...' : prices.jewelPrice?.toFixed(3)} USDC</a>
              <a className="block cursor-pointer" href="https://dexscreener.com/harmony/0x8e6c2ee1f55ff482caea84e7cfedf34d259864d9" target="_blank" rel="noreferrer"><span className="text-gray-500">$gmJEWEL</span> {loadingPrices ? '...' : prices.gmJewelPriceInJewel?.toFixed(3)} JEWEL</a>
              <a className="block cursor-pointer" href="https://preview.dexscreener.io/harmony/0x33af0e5bfa4552db2390c01e1f5646689037e04e" target="_blank" rel="noreferrer"><span className="text-gray-500">$GMG</span> {loadingPrices ? '...' : prices.gmgPriceInJewel?.toFixed(5)} JEWEL</a>
            </div>

            {indexerIsBehind && (
              <div className="px-4 py-2 mt-1 mb-3 bg-red-200 border border-red-400 text-red-800 rounded-lg text-sm text-center">
                <p>The GMG API is having problems indexing the chain - data may be outdated.</p>
              </div>
            )}
          </div>

          <div className={classNames("my-auto flex flex-col items-center font-lora")}>
            {accountData ? (
              <>
                {accountData.ens?.name
                  ? `${accountData.ens?.name} (${accountData.address})`
                  : shortenAddress(accountData.address)}

                <button onClick={disconnect}>Disconnect</button>
              </>
            ) : (
              <>
                {connectData.connectors.map((x) => (
                  <button disabled={!x.ready} key={x.id} onClick={() => connect(x)} className="font-lora">
                    {x.name}
                    {!x.ready && " (unsupported)"}
                  </button>
                ))}

                {connectError && (
                  <div>{connectError?.message ?? "Failed to connect"}</div>
                )}
              </>
            )}
            <MarketSounds />
          </div>
        </div>
        <Navigator />
      </section>
    </div>
  );
};

const pages = [
  { page: "/home", description: "Home" },
  { page: "/mint", description: "Mint" },
  { page: "/redeem", description: "Redeem" },
  { page: "/trade", description: "Trade" },
  { page: "/stake", description: "Stake" },
  { page: "/info", description: "Info" },
];

const Navigator = () => {
  const {pathname} = useLocation();
  return (
      <div
        className={classNames(
          "flex flex-wrap dark:border-gray-700 bg-white flex-auto flex-space-between justify-evenly rounded-b-lg"
        )}
      >
        {pages.map((page, i) => {
          return (
            <Link key={i} to={page.page}>
              <button className={classNames(
                "px-6 text-center py-2",
                page.page === pathname ? "bg-rune/25 hover:bg-rune/50" : "hover:bg-gray-100"
              )}>
                <span className={classNames("mx-1 text-lg sm:text-base font-lora")}>
                  {page.description}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
  );
};
