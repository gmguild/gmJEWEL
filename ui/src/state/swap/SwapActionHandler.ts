import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { Field, typeInput } from "./actions";

export function useSwapActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void;
} {
  const dispatch = useAppDispatch();

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  return { onUserInput };
}
