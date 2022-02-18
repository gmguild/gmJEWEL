import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ethers } from "ethers";
import { Header } from "./Header";
import { InjectedConnector } from "wagmi/connectors/injected";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider, Chain } from "wagmi";
import { rpcUrl } from "../utils/env";
import Home from "../pages/Home";
import Info from "../pages/Info";
import Mint from "../pages/Mint";
import React from "react";
import Redeem from "../pages/Redeem";
import Stake from "../pages/Stake";
import store, { persistor } from "../state";
import Trade from "../pages/Trade";

const chains: Chain[] = [
  {
    id: 1666600000,
    name: "Harmony",
    nativeCurrency: {
      decimals: 18,
      name: "ONE",
      symbol: "ONE",
    },
    rpcUrls: [rpcUrl],
    blockExplorers: [],
    testnet: true,
  },
];

const connectors = [
  new InjectedConnector({
    chains,
  }),
];

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

export function App() {
  return (
    <Provider autoConnect connectors={connectors} provider={provider}>
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor}>
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
        </PersistGate>
      </ReduxProvider>
    </Provider>
  );
}
