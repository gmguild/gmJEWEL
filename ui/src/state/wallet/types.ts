import { CurrencyAmount, Token } from "../../package";

type TokenAddress = string;

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>;
