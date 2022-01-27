import React from "react";
import { useGetAggSummary } from "../hooks/agg/useGetAggSummary";
import { classNames } from "../utils/classNames";
import { bigNumberToFloat } from "../utils/conversion";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <AggregateDataSummary />
      <article className="prose font-lora mx-auto p-4 pb-32">
        <h2>About The Greedy Merchants Guild</h2>
        <p>
          Greedy Merchants Guild creates a market for heroes to trade their
          locked Jewel. We utilise clever smart contracts to create
          &apos;gmJEWEL&apos;, an ERC20 token which represents your locked
          Jewel. This ERC20 token can be used to interact with other DeFi
          protocols.
        </p>
        <h2>Getting Started</h2>
        <p>
          If you want to sell your locked Jewel, please go to the
          &quot;Mint&quot; page. This will allow you to create gmJEWEL, which
          can be sold on the secondary market.
        </p>
        <p>
          If you are looking to buy locked Jewel, please go to the
          &quot;Trade&quot; page which will take you to the DefiKingdoms
          exchange.
        </p>
        <p>
          If you have bought gmJEWEL, and wish to redeem the underlying locked
          Jewel, please visit the &quot;Redeem&quot; page.
        </p>
        <p>
          If you want to learn more about how it works, and the fees involved,
          please visit the &quot;Info&quot; page. Any other questions, feel free
          to chat with us on social media!
        </p>
      </article>
    </div>
  );
}

function AggregateDataSummary() {
  const [aggSummary, loading] = useGetAggSummary();

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-center py-8 gap-4">
      <div className="flex flex-col justify-center items-center p-4 bg-white shadow-md rounded-md">
        <p className="italic text-gray-500 text-center mx-auto text-xs md:text-sm">
          Total Stashes
        </p>
        <p className={classNames("text-center", loading ? "text-sm" : "text-base")}>
          {loading ? 'loading' : aggSummary.totalStashes === null ? '-' : aggSummary.totalStashes}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-white shadow-md rounded-md col-span-2">
        <p className="italic text-gray-500 text-center mx-auto text-xs md:text-sm">
          Total Locked JEWEL
        </p>
        <p className={classNames("text-center", loading ? "text-sm" : "text-base")}>
          {loading ? 'loading' : aggSummary.lockedJewelTotal === null ? '-' : bigNumberToFloat(aggSummary.lockedJewelTotal).toLocaleString()}
          {!loading && ' JEWEL'}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-white shadow-md rounded-md col-span-2">
        <p className="italic text-gray-500 text-center mx-auto text-xs md:text-sm">
          Total Redemption Volume
        </p>
        <p className={classNames("text-center", loading ? "text-sm" : "text-base")}>
          {loading ? 'loading' : aggSummary.totalRedemptionsVolume === null ? '-' : bigNumberToFloat(aggSummary.totalRedemptionsVolume).toLocaleString()}
          {!loading && ' JEWEL'}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-white shadow-md rounded-md">
        <p className="italic text-gray-500 text-center mx-auto text-xs md:text-sm">
          Total Fees Paid
        </p>
        <p className={classNames("text-center", loading ? "text-sm" : "text-base")}>
          {loading ? 'loading' : aggSummary.totalFeesPaid === null ? '-' : bigNumberToFloat(aggSummary.totalFeesPaid).toLocaleString()}
          {!loading && ' JEWEL'}
        </p>
      </div>
    </div>
  )
}
