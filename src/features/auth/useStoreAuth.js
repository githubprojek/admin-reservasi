import { create } from "zustand";
import { axiosAuth } from "../../utils/Axios.js";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  staffList: [],
  isLoggedIn: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosAuth.post("/login", { email, password });
      set({ user: res.data.user, isLoggedIn: true, isLoading: false });
      return res.data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Terjadi kesalahan saat login.",
      });
      throw err.response?.data?.message || "Terjadi kesalahan saat login.";
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosAuth.get("/check-auth");
      set({ user: res.data.user, isLoggedIn: true, isLoading: false });
    } catch (err) {
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosAuth.post("/logout", {});
      set({ user: null, isLoggedIn: false, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: "Gagal logout." });
    }
  },

  getStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosAuth.get("/getUser");
      set({ staffList: res.data.login, isLoading: false });
    } catch (error) {
      console.error("Get staff error:", error);
      set({ error: "Gagal memuat data staff", isLoading: false });
    }
  },

  addStaff: async (staffData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosAuth.post("/register", staffData);
      set((state) => ({
        staffList: [...state.staffList, res.data.data],
        isLoading: false,
      }));
      return res.data;
    } catch (error) {
      console.error("Add staff error:", error);
      set({ isLoading: false, error: error.response?.data?.message || "Gagal menambahkan staff" });
      throw error.response?.data?.message || "Gagal menambahkan staff";
    }
  },

  updateStaff: async (staffId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosAuth.put(`/updateStaff/${staffId}`, updatedData);
      set((state) => ({
        staffList: state.staffList.map((staff) => (staff._id === staffId ? res.data.staff : staff)),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Update staff error:", error);
      set({ isLoading: false, error: error.response?.data?.message || "Gagal update staff" });
      throw error.response?.data?.message || "Gagal update staff";
    }
  },

  deleteStaff: async (staffId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosAuth.delete(`/deleteStaff/${staffId}`);
      set((state) => ({
        staffList: state.staffList.filter((staff) => staff._id !== staffId),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Delete staff error:", error);
      set({ isLoading: false, error: error.response?.data?.message || "Gagal hapus staff" });
      throw error.response?.data?.message || "Gagal hapus staff";
    }
  },
}));
