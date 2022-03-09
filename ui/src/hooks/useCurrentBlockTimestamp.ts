import { BigNumber } from "ethers";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useMulticall2Contract } from "./contract/useContract";

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticall2Contract();
  return useSingleCallResult(multicall, "getCurrentBlockTimestamp")
    ?.result?.[0];
}
