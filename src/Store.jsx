import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

const API_BASE = "https://findcourse.net.uz/api";

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

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: localStorage.getItem("accessToken") || null,
      refreshToken: localStorage.getItem("refreshToken") || null,
      profileImageUrl: null,

      fetchUserData: async () => {
        try {
          const token = await get().refreshTokenFunc(false);
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
          console.error("Login error:", error.response?.data || error.message);
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
          return "https://via.placeholder.com/40";
        }

        try {
          const res = await axios.get(`${API_BASE}/image/${filename}`, {
            responseType: "blob",
          });
          return URL.createObjectURL(res.data);
        } catch (error) {
          return "https://via.placeholder.com/40";
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
      console.error("Error fetching users:", error);
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
      toast.success("User updated");
    } catch (error) {
      toast.error("Error updating user");
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
      toast.success("User deleted");
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Delete error:", error);
    }
  },
}));
export const useCardStore = create((set, get) => ({
  majors: [],
  regions: [],
  allCenters: [],
  filteredCenters: [],
  selectedMajors: [],
  selectedRegions: [],
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const [majorsRes, regionsRes, centersRes] = await Promise.all([
        axios.get(`${API_BASE}/major`),
        axios.get(`${API_BASE}/regions/search`),
        axios.get(`${API_BASE}/centers`),
      ]);

      const majors = majorsRes.data.data || [];
      const regions = regionsRes.data.data || [];

      const centers = centersRes.data.data?.map((center) => {
        const comments = center.comments || [];
        const avgRating =
          comments.length > 0
            ? comments.reduce((sum, c) => sum + c.star, 0) / comments.length
            : 0;

        return {
          ...center,
          imageUrl: center.image ? `${API_BASE}/image/${center.image}` : null,
          rating: avgRating,
        };
      }) || [];

      set({
        majors,
        regions,
        allCenters: centers,
        filteredCenters: centers,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching card data:", error);
      set({ loading: false });
    }
  },

  setSelectedMajors: (selected) => {
    if (!Array.isArray(selected)) selected = [];
    set({ selectedMajors: selected }, get().filterCenters);
  },

  setSelectedRegions: (selected) => {
    if (!Array.isArray(selected)) selected = [];
    set({ selectedRegions: selected }, get().filterCenters);
  },

  removeMajor: (id) => {
    const updated = get().selectedMajors.filter((m) => m !== id);
    set({ selectedMajors: updated }, get().filterCenters);
  },

  removeRegion: (id) => {
    const updated = get().selectedRegions.filter((r) => r !== id);
    set({ selectedRegions: updated }, get().filterCenters);
  },

  filterCenters: () => {
    const { allCenters, selectedMajors, selectedRegions } = get();
    let filtered = allCenters;

    if (selectedMajors.length > 0) {
      filtered = filtered.filter((c) => selectedMajors.includes(c.majorId));
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter((c) => selectedRegions.includes(c.regionId));
    }

    const term = useSearchStore.getState().searchTerm.toLowerCase();
    if (term.trim()) {
      filtered = filtered.filter((center) => {
        const nameMatch = center.name?.toLowerCase().includes(term);
        const addressMatch = center.address?.toLowerCase().includes(term);
        const majorMatch = center.majors?.some((m) =>
          m.name?.toLowerCase().includes(term)
        );
        return nameMatch || addressMatch || majorMatch;
      });
    }

    set({ filteredCenters: filtered });
    console.log(filtered)
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

      const dataForSave = data.data.map((center) => ({
        name: center.name,
        link: "CEO",
      }));

      localStorage.setItem("Centers", JSON.stringify(dataForSave));
    } catch (error) {
      console.error("Error fetching centers:", error);
if (error.response?.status === 401) {
  const newToken = await useAuthStore.getState().refreshTokenFunc();
  if (newToken) {
    return axios.get(`${API_BASE}/centers`, {
      headers: { Authorization: `Bearer ${newToken}` },
    });
  }
  useAuthStore.getState().logout();
  return [];
}
      set({ error: "Failed to load centers." });
    } finally {
      set({ loading: false });
    }
  },

  addCenter: async (centerData) => {
    try {
      set({ loading: true, error: null });

      let token =
        useAuthStore.getState().accessToken ||
        (await useAuthStore.getState().refreshTokenFunc());
      if (!token) throw new Error("No valid authentication token");

      const newCenter = {
        name: centerData.name.trim(),
        address: centerData.address.trim(),
        phone: centerData.phone?.trim() || null,
        email: centerData.email?.trim() || "",
        description: centerData.description?.trim() || "",
        regionId: String(centerData.regionId),
        majorsId: centerData.majorsId.length
          ? centerData.majorsId.map(String)
          : ["1"],
        image: centerData.image || null,
      };

      const response = await axios.post(`${API_BASE}/centers`, newCenter, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({ centers: [...state.centers, response.data] }));
      toast.success("Center added");
    } catch (error) {
      console.error(
        "Error adding center:",
        error.response?.data || error.message
      );
      set({ error: error.response?.data?.message || "Failed to add center" });
      toast.error("Failed to add center.");
    } finally {
      set({ loading: false });
    }
  },

  deleteCenter: async (id) => {
    try {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) {
        toast.error("Authentication required");
        return false;
      }

      await axios.delete(`${API_BASE}/centers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        centers: state.centers.filter((c) => c.id !== id),
      }));

      toast.success("Center deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete center");
      return false;
    }
  },
}));
