import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";



export const useSidebarStore = create((set) => ({
    side: false,
    closeSidebar: () => set(() => ({ side: false })),
    openSidebar: () => set(() => ({ side: true })),
  }));