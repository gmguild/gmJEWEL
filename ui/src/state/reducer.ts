import { combineReducers } from "@reduxjs/toolkit";

import multicall from "./multicall/reducer";
import swap from "./swap/reducer";
import application from "./application/reducer";
import lists from "./lists/reducer";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import web3Context from "./global/web3ContextSlice";

const reducer = combineReducers({
  multicall,
  swap,
  lists,
  application,
  user,
  transactions,
  web3Context,
});

export default reducer;
