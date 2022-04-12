import invariant from "tiny-invariant";
import { WNATIVE } from "../../constants";
import { Currency } from "../Currency";
import { NativeCurrency } from "../NativeCurrency";
import { Token } from "../Token";

export class DFK extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, "JEWEL", "Jewel");
  }

  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId];
    invariant(!!wnative, "WRAPPED");
    return wnative;
  }

  private static _cache: { [chainId: number]: DFK } = {};

  public static onChain(chainId: number): DFK {
    return this._cache[chainId] ?? (this._cache[chainId] = new DFK(chainId));
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
