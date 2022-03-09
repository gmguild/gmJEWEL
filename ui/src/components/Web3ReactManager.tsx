import React from "react";
import { FC, useEffect, useState } from "react";
import { network } from "../config/wallets";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "../constants";
import useNetworkOrchistrator from "../hooks/util/useNetworkOrchistrator";
import useEagerConnect from "../hooks/util/useEagerConnect";
import useInactiveListener from "../hooks/util/useInactiveListener";
import Loader from "./Loader";

export const Web3ReactManager: FC = ({ children }) => {
  const { active } = useWeb3React();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  useNetworkOrchistrator();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  // useEffect(() => {
  //   const activate = async () => {
  //     if (triedEager && !networkActive && !networkError && !active) {
  //       const Cookies = (await import("js-cookie")).default;
  //       console.log("CHANGE CHAIN TO " + Number(Cookies.get("chain-id")));
  //       network.changeChainId(Number(Cookies.get("chain-id")));
  //       activateNetwork(network);
  //     }
  //   };
  //   activate();
  // }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  // useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <>{children}</>;

  // on page load, do nothing until we've tried to connect to the injected connector
  // if (!triedEager) {
  //   return null;
  // }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-secondary">
          {`Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device`}
        </div>
      </div>
    );
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <div className="flex items-center justify-center h-80">
        <Loader />
      </div>
    ) : null;
  }

  return <>{children}</>;
};

export default Web3ReactManager;
