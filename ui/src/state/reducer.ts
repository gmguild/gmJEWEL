import { combineReducers } from "@reduxjs/toolkit";

import multicall from "./multicall/reducer";
import swap from "./swap/reducer";
import application from "./application/reducer";

const reducer = combineReducers({
  multicall,
  swap,
  application,
});

export default reducer;
