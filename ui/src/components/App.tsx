import { ethers } from "ethers";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, Chain } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Home from "../pages/Home";
import Info from "../pages/Info";
import Mint from "../pages/Mint";
import Redeem from "../pages/Redeem";
import Stake from "../pages/Stake";
import Trade from "../pages/Trade";
import { Header } from "./Header";

const chains: Chain[] = [
  {
    id: 1666600000,
    name: "Harmony Local",
    nativeCurrency: {
      decimals: 18,
      name: "ONE",
      symbol: "ONE",
    },
    rpcUrls: ["http://localhost:8545"],
    blockExplorers: [],
    testnet: true,
  },
];

const connectors = [
  new InjectedConnector({
    chains,
  }),
];

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

export function App() {
  return (
    <Provider autoConnect connectors={connectors} provider={provider}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
