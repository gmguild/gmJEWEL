import React from "react";
import ApplicationUpdater from "./application/updater";
import ListUpdater from "./lists/updater";
import MulticallUpdater from "./multicall/updater";
import TransactionUpdater from "./transactions/updater";
import UserUpdater from "./user/updater";

export default function Updaters() {
  return (
    <>
      <MulticallUpdater />
      <ApplicationUpdater />
      <ListUpdater />
      <TransactionUpdater />
      <UserUpdater />
    </>
  );
}
