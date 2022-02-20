import { createReducer } from "@reduxjs/toolkit";
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from "./actions";

export interface SwapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly recipient?: string;
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: "",
  [Field.INPUT]: {
    currencyId: "",
  },
  [Field.OUTPUT]: {
    currencyId: "",
  },
  recipient: undefined,
};

export default createReducer<SwapState>(initialState, (builder) => {
  builder
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    })
    .addCase(
      replaceSwapState,
      (
        state,
        {
          payload: {
            typedValue,
            recipient,
            field,
            inputCurrencyId,
            outputCurrencyId,
          },
        }
      ) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue: typedValue,
          recipient,
        };
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === state[otherField].currencyId) {
        return {
          ...state,
          independentField:
            state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        };
      } else {
        return {
          ...state,
          [field]: { currencyId: currencyId },
        };
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField:
          state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      };
    })
    .addCase(setRecipient, (state, { payload: recipient }) => {
      state.recipient = recipient;
    });
});
