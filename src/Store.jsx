import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";



export const useSidebarStore = create((set) => ({
    side: false,
    closeSidebar: () => set(() => ({ side: false })),
    openSidebar: () => set(() => ({ side: true })),
  }));

export const useOpenStore = create((set) => ({
    open: true,
    closeOpen: () => set(() => ({ open: false })),
    openOpen: () => set(() => ({ open: true })),
  }));