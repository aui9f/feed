import { UserType } from "@/app/actions/getUser";
import { create } from "zustand";

type UserStore = {
  user: UserType | null;
  setUser: (user: UserType) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
