import React from "react";

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export const NumericInput = React.memo(
  ({
    value,
    onUserInput,
  }: {
    value: string | number;
    onUserInput: (input: string) => void;
  }) => {
    const enforcer = (nextUserInput: string) => {
      if (
        nextUserInput === "" ||
        inputRegex.test(escapeRegExp(nextUserInput))
      ) {
        onUserInput(nextUserInput);
      }
    };
    return (
      <input
        value={value}
        onChange={(event) => {
          enforcer(event.target.value.replace(/,/g, "."));
        }}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";

export default NumericInput;
