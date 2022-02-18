import { createAction } from "@reduxjs/toolkit";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const typeInput =
  createAction<{ field: Field; typedValue: string }>("swap/typeInput");
