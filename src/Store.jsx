import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";




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


import { toast } from "sonner";

const API_BASE = "http://18.141.233.37:4000/api";

export const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    profileImageUrl: null,
  
    fetchUserData: async () => {
      try {
        const token = await get().refreshTokenFunc(false); // don't logout immediately on missing token
        if (!token) return null;
  
        const { data } = await axios.get(`${API_BASE}/users/mydata`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        let role = data?.role;
        if (!role && token) {
          try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            role = decoded?.role || "USER";
          } catch {
            role = "USER";
          }
        }
  
        const userData = { ...data, role };
        set({ user: userData });
        // console.log(userData);
        return userData;
      } catch (error) {
        console.warn("Failed to fetch user data:", error?.response?.data || error);
        return null;
      }
    },
  
    login: async (values) => {
      try {
        const res = await axios.post(`${API_BASE}/users/login`, values);
        // console.log("🟢 Raw login response:", res); // 👈 Add this line
    
        const { accessToken, refreshToken } = res.data;
    
        if (accessToken && refreshToken) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ accessToken, refreshToken });
    
          const user = await get().fetchUserData();
          return { success: true, role: user?.role };
        }
    
        return { success: false, message: "Tokens missing in response" };
      } catch (error) {
        console.error("🔴 Login error response:", error.response?.data || error.message); // 👈 Add this line too
        return {
          success: false,
          message: error.response?.data?.message || "Login failed",
        };
      }
    },
  
    refreshTokenFunc: async (shouldLogout = true) => {
      const refreshToken = get().refreshToken;
  
      if (!refreshToken) {
        if (shouldLogout) get().logout();
        return null;
      }
  
      try {
        const { data } = await axios.post(`${API_BASE}/users/refreshToken`, {
          refreshToken,
        });
  
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          set({ accessToken: data.accessToken });
          return data.accessToken;
        }
  
        if (shouldLogout) get().logout();
        return null;
      } catch (error) {
        if (shouldLogout) get().logout();
        return null;
      }
    },
  
    isLoggedIn: () => !!get().user?.isActive,
  
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null, accessToken: null, refreshToken: null, profileImageUrl: null });
    },
  
    deleteAccount: async () => {
      try {
        const { user, refreshTokenFunc, logout } = get();
        const token = await refreshTokenFunc();
        const userId = user?.data?.id;
  
        if (!token || !userId) return toast.error("User not authenticated");
  
        await axios.delete(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        toast.success("Account deleted successfully");
        logout();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete account");
      }
    },
  
    autoRefreshToken: () => {
      const scheduleRefresh = () => {
        const token = get().accessToken;
        if (!token) return;
  
        try {
          const { exp } = JSON.parse(atob(token.split(".")[1]));
          const timeUntilExpiry = exp * 1000 - Date.now() - 30000;
  
          setTimeout(() => {
            get().refreshTokenFunc();
          }, timeUntilExpiry > 0 ? timeUntilExpiry : 0);
        } catch {
          get().logout();
        }
      };
  
      scheduleRefresh();
    },
  
    fetchProfileImage: async (filename) => {
      if (!filename) {
        set({ profileImageUrl: null });
        return;
      }
  
      try {
        const res = await axios.get(`${API_BASE}/image/${filename}`, {
          responseType: "blob",
        });
  
        const blobUrl = URL.createObjectURL(res.data);
        set({ profileImageUrl: blobUrl });
      } catch {
        set({ profileImageUrl: null });
      }
    },
}));