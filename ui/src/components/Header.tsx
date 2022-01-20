import React from "react";
import { useAccount, useConnect } from "wagmi";
import { classNames } from "../utils/classNames";
import { shortenAddress } from "../utils/conversion";
import logo from "../assets/GMG.png";
import { Link, useLocation } from "react-router-dom";
import { MarketSounds } from "./MarketSounds";
import { usePrices } from "../hooks/token/usePrices";

export const Header = () => {
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
            <img src={logo} className={classNames("h-24 w-full mx-auto")} />
            <a className="text-xs underline text-gray-700 hover:text-blue-600" href="https://twitter.com/gmguild69" target="_blank" rel="noreferrer">
              Twitter
            </a>
          </div>

          <div className="flex flex-col items-center">
            <h1 className={classNames("text-lg md:text-2xl my-2 text-gray-700 text-center")}>
              Greedy Merchants Guild
            </h1>

            <div className="flex flex-row flex-wrap items-center justify-center text-sm space-x-2 my-2">
              <p><span className="text-gray-500">$JEWEL</span> {loadingPrices ? '...' : prices.jewelPrice?.toFixed(3)} USDC</p>
              <p><span className="text-gray-500">$gmJEWEL</span> {loadingPrices ? '...' : prices.gmJewelPriceInJewel?.toFixed(3)} JEWEL</p>
              <p><span className="text-gray-500">$GMG</span> {loadingPrices ? '...' : prices.gmgPriceInJewel?.toFixed(3)} JEWEL</p>
            </div>
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
