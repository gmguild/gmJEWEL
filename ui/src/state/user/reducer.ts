import { createReducer } from "@reduxjs/toolkit";
import { DEFAULT_DEADLINE_FROM_NOW } from "../../constants";
import { updateVersion } from "../global/actions";
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  toggleURLWarning,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSingleHopOnly,
} from "./actions";

const currentTimestamp = () => new Date().getTime();

export interface UserState {
  lastUpdateVersionTimestamp?: number;
  userExpertMode: boolean;
  userSingleHopOnly: boolean;
  userDeadline: number;
  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken;
    };
  };
  pairs: {
    [chainId: number]: {
      [key: string]: SerializedPair;
    };
  };
  timestamp: number;
  URLWarningVisible: boolean;
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}}`;
}

export const initialState: UserState = {
  userExpertMode: false,
  userSingleHopOnly: false,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateVersion, (state) => {
      if (typeof state.userDeadline !== "number") {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW;
      }
      state.lastUpdateVersionTimestamp = currentTimestamp();
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly;
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      state.tokens[serializedToken.chainId] =
        state.tokens[serializedToken.chainId] || {};
      state.tokens[serializedToken.chainId][serializedToken.address] =
        serializedToken;
      state.timestamp = currentTimestamp();
    })
    .addCase(
      removeSerializedToken,
      (state, { payload: { address, chainId } }) => {
        state.tokens[chainId] = state.tokens[chainId] || {};
        delete state.tokens[chainId][address];
        state.timestamp = currentTimestamp();
      }
    )
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId;
        state.pairs[chainId] = state.pairs[chainId] || {};
        state.pairs[chainId][
          pairKey(serializedPair.token0.address, serializedPair.token1.address)
        ] = serializedPair;
      }
      state.timestamp = currentTimestamp();
    })
    .addCase(
      removeSerializedPair,
      (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
        if (state.pairs[chainId]) {
          delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)];
          delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)];
        }
        state.timestamp = currentTimestamp();
      }
    )
    .addCase(toggleURLWarning, (state) => {
      state.URLWarningVisible = !state.URLWarningVisible;
    });
});
