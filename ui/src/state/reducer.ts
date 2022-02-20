import { combineReducers } from "@reduxjs/toolkit";

import multicall from "./multicall/reducer";
import swap from "./swap/reducer";
import application from "./application/reducer";
import lists from "./lists/reducer";

const reducer = combineReducers({
  multicall,
  swap,
  lists,
  application,
});

export default reducer;
