import { combineReducers } from "@reduxjs/toolkit";

import swap from "./swap/reducer";

const reducer = combineReducers({
  swap,
});

export default reducer;
