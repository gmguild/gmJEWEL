import { useCallback, useMemo } from "react";
import { AppState } from "..";
import { useActiveWeb3React } from "../../services/web3/hooks/useActiveWeb3React";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setOpenModal,
} from "./actions";

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();

  return useAppSelector(
    (state) => state.application.blockNumber[chainId ?? -1]
  );
}

export function useBlockTimestamp(): number | undefined {
  const { chainId } = useActiveWeb3React();

  return useAppSelector(
    (state) => state.application.blockTimestamp[chainId ?? -1]
  );
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state) => state.application.openModal);
  return openModal === modal;
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useAppDispatch();
  return useCallback(
    () => dispatch(setOpenModal(open ? null : modal)),
    [dispatch, modal, open]
  );
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal]);
}

export function useCloseModals(): () => void {
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(setOpenModal(null)), [null]);
}

export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }));
    },
    [dispatch]
  );
}

export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
}

export function useActivePopups(): AppState["application"]["popupList"] {
  const list = useAppSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}
