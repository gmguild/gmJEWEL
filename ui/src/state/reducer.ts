import { combineReducers } from "@reduxjs/toolkit";

import multicall from "./multicall/reducer";
import swap from "./swap/reducer";
import application from "./application/reducer";
import lists from "./lists/reducer";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import web3Context from "./global/web3ContextSlice";
import slippage from "./slippage/slippageSlice";
import mint from "./mint/reducer";
import burn from "./burn/reducer";

const reducer = combineReducers({
  multicall,
  swap,
  lists,
  application,
  user,
  transactions,
  web3Context,
  slippage,
  mint,
  burn,
});

export default reducer;
