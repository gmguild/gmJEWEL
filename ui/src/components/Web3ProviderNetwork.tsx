import React from "react";
import { NetworkContextName } from "../constants";
import { createWeb3ReactRoot } from "@web3-react/core";

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName);

// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
function Web3ProviderNetwork({ children, getLibrary }) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>;
}

export default Web3ProviderNetwork;
