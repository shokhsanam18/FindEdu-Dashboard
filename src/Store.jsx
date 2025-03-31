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

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // your current state
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
          console.warn(
            "Failed to fetch user data:",
            error?.response?.data || error
          );
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
          console.error(
            "🔴 Login error response:",
            error.response?.data || error.message
          ); // 👈 Add this line too
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
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          profileImageUrl: null,
        });
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
          toast.error(
            error?.response?.data?.message || "Failed to delete account"
          );
        }
      },

      autoRefreshToken: () => {
        const scheduleRefresh = () => {
          const token = get().accessToken;
          if (!token) return;

          try {
            const { exp } = JSON.parse(atob(token.split(".")[1]));
            const timeUntilExpiry = exp * 1000 - Date.now() - 30000;

            setTimeout(
              () => {
                get().refreshTokenFunc();
              },
              timeUntilExpiry > 0 ? timeUntilExpiry : 0
            );
          } catch {
            get().logout();
          }
        };

        scheduleRefresh();
      },

      fetchProfileImage: async (filename) => {
        if (
          !filename ||
          filename === "image.jpg" ||
          filename === "default.jpg"
        ) {
          // You can tweak the condition to catch more default/broken names
          return "https://via.placeholder.com/40";
        }

        try {
          const res = await axios.get(`${API_BASE}/image/${filename}`, {
            responseType: "blob",
          });

          return URL.createObjectURL(res.data);
        } catch (error) {
          // Silently fail and return fallback
          return "https://via.placeholder.com/40"; // or return null and handle in component
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

export const useUserStore = create((set, get) => ({
  fetchUsers: async (page = 1, usersPerPage = 150) => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return [];

    try {
      const { data } = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          take: usersPerPage,
          page,
          sortBy: "id",
          sortOrder: "ASC",
        },
      });
      return data?.data || [];
    } catch (error) {
      console.error("❌ Ошибка при загрузке пользователей:", error);
      return [];
    }
  },

  editUser: async (id, newEmail) => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    try {
      await axios.patch(
        `${API_BASE}/users/${id}`,
        { email: newEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Пользователь обновлён");
    } catch (error) {
      toast.error("Ошибка обновления пользователя");
      console.error("Edit error:", error);
    }
  },

  deleteUser: async (id) => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    try {
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Пользователь удалён");
    } catch (error) {
      toast.error("Ошибка удаления пользователя");
      console.error("Delete error:", error);
    }
  },
}));

export const useCenterStore = create((set, get) => ({
  centers: [],
  loading: false,
  error: null,

  fetchCenters: async () => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    set({ loading: true, error: null });

    try {
      const { data } = await axios.get(`${API_BASE}/centers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ centers: data?.data || [] });
    } catch (error) {
      console.error("❌ Error fetching centers:", error);
      if (error.response?.status === 401) {
        await useAuthStore.getState().refreshTokenFunc();
        return get().fetchCenters(); // Retry once after refreshing
      }
      set({ error: "Failed to load centers." });
    } finally {
      set({ loading: false });
    }
  },

  addCenter: async (newCenter) => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    try {
      const { data } = await axios.post(`${API_BASE}/centers`, newCenter, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({ centers: [...state.centers, data] }));
      toast.success("Center added");
    } catch (error) {
      console.error("❌ Error adding center:", error);
      toast.error("Failed to add center.");
    }
  },

  deleteCenter: async (centerId) => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    try {
      await axios.delete(`${API_BASE}/centers/${centerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        centers: state.centers.filter((c) => c.id !== centerId),
      }));

      toast.success("Center deleted");
    } catch (error) {
      console.error("❌ Error deleting center:", error);
      toast.error("Failed to delete center.");
    }
  },
}));

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: localStorage.getItem("theme") || "system",
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        localStorage.setItem("theme", newTheme);

        const html = document.documentElement;
        if (newTheme === "system") {
          const systemPref = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          html.className = systemPref;
        } else {
          html.className = newTheme;
        }
      },
      applyTheme: () => {
        const currentTheme = get().theme;
        const html = document.documentElement;
        if (currentTheme === "system") {
          const systemPref = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          html.className = systemPref;
        } else {
          html.className = currentTheme;
        }
      },
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCentersStore = create((set, get) => ({
  centers: [],
  loading: false,
  error: null,

  fetchCenters: async () => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    set({ loading: true, error: null });

    try {
      const { data } = await axios.get(`${API_BASE}/centers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ centers: data?.data || [] });
    } catch (error) {
      console.error("❌ Error fetching centers:", error);
      if (error.response?.status === 401) {
        await useAuthStore.getState().refreshTokenFunc();
        return get().fetchCenters(); // Retry once after refreshing
      }
      set({ error: "Failed to load centers." });
    } finally {
      set({ loading: false });
    }
  },

  addCenter: async (centerData) => {
    try {
      set({ loading: true, error: null });

      let token = get().accessToken || (await get().refreshTokenFunc());
      if (!token) throw new Error("No valid authentication token");

      const newCenter = {
        name: centerData.name.trim(),
        address: centerData.address.trim(),
        phone: centerData.phone?.trim() || null,
        email: centerData.email?.trim() || "",
        description: centerData.description?.trim() || "",
        regionId: String(centerData.regionId), // ✅ Convert to string if needed
        majorsId: centerData.majorsId.length
          ? centerData.majorsId.map(String)
          : ["1"], // ✅ Convert to strings if needed
        image: centerData.image || null,
      };

      console.log(
        "🚀 Final Payload to API:",
        JSON.stringify(newCenter, null, 2)
      );

      const response = await axios.post(`${API_BASE}/api/centers`, newCenter, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Center added successfully:", response.data);
    } catch (error) {
      console.error(
        "❌ Error adding center:",
        error.response?.data || error.message
      );
      set({ error: error.response?.data?.message || "Failed to add center" });
    } finally {
      set({ loading: false });
    }
  },
  deleteCenter: async (centerId) => {
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) return;

    try {
      await axios.delete(`${API_BASE}/centers/${centerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        centers: state.centers.filter((c) => c.id !== centerId),
      }));

      toast.success("Center deleted");
    } catch (error) {
      console.error("❌ Error deleting center:", error);
      toast.error("Failed to delete center.");
    }
  },
}));
