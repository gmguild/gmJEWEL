import { combineReducers } from "@reduxjs/toolkit";

import multicall from "./multicall/reducer";
import swap from "./swap/reducer";

const reducer = combineReducers({
  multicall,
  swap,
});

export default reducer;
