import { useCallback, useEffect, useState } from "react";
import useDebounce from "../../hooks/util/useDebounce";
import { useActiveWeb3React } from "../../services/web3/hooks/useActiveWeb3React";
import { useAppDispatch } from "../hooks";
import {
  updateBlockNumber,
  updateBlockTimestamp,
  updateChainId,
} from "./actions";
import { Block } from "@ethersproject/abstract-provider";
import useIsWindowVisible from "../../hooks/util/useIsWindowVisible";
import { ChainId } from "../../package";

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
    blockTimestamp: number | null;
  }>({
    chainId,
    blockNumber: null,
    blockTimestamp: null,
  });

  const blockCallback = useCallback(
    (block: Block) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (
            typeof state.blockNumber !== "number" &&
            typeof state.blockTimestamp !== "number"
          )
            return {
              chainId,
              blockNumber: block.number,
              blockTimestamp: block.timestamp,
            };
          return {
            chainId,
            blockNumber: Math.max(block.number, state.blockNumber ?? 0),
            blockTimestamp: Math.max(
              block.timestamp,
              state.blockTimestamp ?? 0
            ),
          };
        }
        return state;
      });
    },
    [chainId, setState]
  );

  const onBlock = useCallback(
    (number) => {
      //eslint-disable-next-line
      //@ts-ignore
      return library.getBlock(number).then(blockCallback);
    },
    [blockCallback, library]
  );

  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null, blockTimestamp: null });

    library
      .getBlock("latest")
      .then(blockCallback)
      .catch((error) =>
        console.error(`Failed to get block for chainId: ${chainId}`, error)
      );

    library.on("block", onBlock);
    return () => {
      library.removeListener("block", onBlock);
    };
  }, [dispatch, chainId, library, windowVisible, blockCallback, onBlock]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockNumber ||
      !windowVisible
    )
      return;
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      })
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockNumber,
    debouncedState.chainId,
  ]);

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockTimestamp ||
      !windowVisible
    )
      return;
    dispatch(
      updateBlockTimestamp({
        chainId: debouncedState.chainId,
        blockTimestamp: debouncedState.blockTimestamp,
      })
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockTimestamp,
    debouncedState.chainId,
  ]);

  useEffect(() => {
    dispatch(
      updateChainId({
        //   eslint-disable-next-line
        // @ts-ignore
        chainId:
          // eslint-disable-next-line
          // @ts-ignore
          debouncedState.chainId in ChainId
            ? debouncedState.chainId ?? null
            : null,
      })
    );
  }, [dispatch, debouncedState.chainId]);

  return null;
}
