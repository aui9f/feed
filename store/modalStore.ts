import { create } from "zustand";

type ModalState = {
  isModal: boolean;
  setModal: (v: boolean) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isModal: false,
  setModal: (v) => set({ isModal: v }),
}));
