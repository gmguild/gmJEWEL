import React from "react";
import { useNetwork } from "wagmi";

export function ChangeNetwork() {
  const [, switchNetwork] = useNetwork();

  if (switchNetwork) {
    return (
      <p>
        Please change your network to{" "}
        <a href="#" onClick={() => switchNetwork(1666600000)}>
          harmony
        </a>
      </p>
    );
  }

  return <></>;
}
