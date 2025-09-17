import { axiosReservasi } from "../../utils/Axios";
import { create } from "zustand";

export const useStoreReservasi = create((set, get) => ({
  reservasiList: [],
  loading: false,
  error: null,

  fetchReservasi: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.get("/getReservasi");
      set({ reservasiList: res.data.reservasi });
      console.log("Fetched reservasi:", res.data.reservasi);
    } catch (error) {
      console.error(error);
      set({ error: "Gagal memuat reservasi" });
    } finally {
      set({ loading: false });
    }
  },

  getReservasiById: async (reservasiId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.get(`/getReservasiById/${reservasiId}`);
      return res.data.reservasi;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal ambil detail reservasi" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createReservasi: async (newData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.post("/createReservasi", newData);
      set((state) => ({
        reservasiList: [...state.reservasiList, res.data.reservasi],
      }));
      return res.data;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal membuat reservasi" });
      return { error: true };
    } finally {
      set({ loading: false });
    }
  },

  updateReservasi: async (reservasiId, updateData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.put(`/updateReservasi/${reservasiId}`, updateData);
      set((state) => ({
        reservasiList: state.reservasiList.map((r) => (r._id === reservasiId ? res.data.reservasi : r)),
      }));
      return res.data;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal update reservasi" });
      return { error: true };
    } finally {
      set({ loading: false });
    }
  },

  deleteReservasi: async (reservasiId) => {
    set({ loading: true, error: null });
    try {
      await axiosReservasi.delete(`/deleteReservasi/${reservasiId}`);
      set((state) => ({
        reservasiList: state.reservasiList.filter((r) => r._id !== reservasiId),
      }));
      return true;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal hapus reservasi" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  checkInReservasi: async (reservasiId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.post(`/checkin/${reservasiId}`);
      set((state) => ({
        reservasiList: state.reservasiList.map((r) => (r._id === reservasiId ? res.data.reservasi : r)),
      }));
      return res.data;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal check-in reservasi" });
      return { error: true };
    } finally {
      set({ loading: false });
    }
  },

  checkOutReservasi: async (reservasiId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.post(`/checkout/${reservasiId}`);
      // Reservasi ini seharusnya dihapus dari list aktif karena diarsip
      set((state) => ({
        reservasiList: state.reservasiList.filter((r) => r._id !== reservasiId),
      }));
      return res.data;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal check-out reservasi" });
      return { error: true };
    } finally {
      set({ loading: false });
    }
  },

  manualCheckout: async (reservasiId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosReservasi.post(`/manualCheckout/${reservasiId}`);
      set((state) => ({
        reservasiList: state.reservasiList.filter((r) => r._id !== reservasiId),
      }));
      return res.data;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal manual checkout reservasi" });
      return { error: true };
    } finally {
      set({ loading: false });
    }
  },

  checkStatusPembayaran: async (reservasiId) => {
    try {
      const res = await axiosReservasi.get(`/cek-status-pembayaran/${reservasiId}`);
      // update state reservasiList biar status terbaru langsung tampil
      set((state) => ({
        reservasiList: state.reservasiList.map((r) => (r._id === reservasiId ? { ...r, paymentStatus: res.data.status } : r)),
      }));
      return res.data;
    } catch (error) {
      console.error("Gagal cek status pembayaran:", error);
      return { error: true };
    }
  },
}));

export default useStoreReservasi;
