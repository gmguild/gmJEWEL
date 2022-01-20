import React from "react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <article className="prose font-lora mx-auto mt-4 p-4 pb-32">
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
          &quot;Mint&quot; page. This will allow you to create gmJEWEL, which can
          be sold on the secondary market.
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
