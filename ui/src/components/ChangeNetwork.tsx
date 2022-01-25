import React from "react";
import { useNetwork } from "wagmi";

export function ChangeNetwork() {
  const [, switchNetwork] = useNetwork();

  if (switchNetwork) {
    return (
      <>
        <p>You must connect your wallet to Harmony Network.</p>
        <button
          className="px-6 text-center py-2 bg-rune/25 hover:bg-rune/50 rounded-md"
          onClick={() => switchNetwork(1666600000)}
        >
          Switch Network
        </button>
      </>
    );
  }

  return <></>;
}
