// useStoreHotel.js
import { axiosHotel } from "../../utils/Axios.js";
import { create } from "zustand";

export const useStoreHotel = create((set, get) => ({
  hotelList: [],
  isLoading: false,
  isError: null,
  isFetched: false, // ✅ Tambah flag cache

  fetchHotel: async (force = false) => {
    // 🔑 Kalau sudah di-cache & tidak dipaksa, skip
    if (get().isFetched && !force) {
      console.log("✅ Data hotel sudah di-cache, skip fetch");
      return;
    }

    set({ isLoading: true, isError: null });
    try {
      const res = await axiosHotel.get("/getHotel");
      set({
        hotelList: res.data.hotels,
        isFetched: true, // ✅ Tandai sudah pernah fetch
      });
    } catch (error) {
      console.error(error);
      set({ isError: "Gagal memuat data hotel" });
    } finally {
      set({ isLoading: false });
    }
  },

  getHotelDetail: async (hotelId) => {
    set({ isLoading: true, isError: null });
    try {
      const res = await axiosHotel.get(`/getHotelById/${hotelId}`);
      return res.data.hotel;
    } catch (error) {
      console.error("Gagal ambil detail hotel:", error);
      set({ isError: "Gagal ambil detail hotel." });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  addHotel: async (hotelData) => {
    set({ isLoading: true, isError: null });
    try {
      const res = await axiosHotel.post("/createHotel", hotelData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        hotelList: [...state.hotelList, res.data.hotel],
        isFetched: true, // ✅ Data valid, tetap cache aktif
      }));
      return res.data;
    } catch (error) {
      console.error("add hotel error", error);
      set({ isError: "Gagal menambahkan hotel" });
      return { error: true };
    } finally {
      set({ isLoading: false });
    }
  },

  updateHotel: async (hotelId, updateHotel) => {
    try {
      set({ isLoading: true, isError: null });
      const res = await axiosHotel.put(`/updateHotel/${hotelId}`, updateHotel);

      // ✅ Perbarui di state juga
      set((state) => ({
        hotelList: state.hotelList.map((hotel) => (hotel._id === hotelId ? res.data.hotels : hotel)),
      }));

      return res.data.hotels;
    } catch (error) {
      console.error("Gagal update hotel:", error);
      set({ isError: "Gagal update hotel." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteHotel: async (hotelId) => {
    set({ isLoading: true, isError: null });
    try {
      const res = await axiosHotel.delete(`/deleteHotel/${hotelId}`);
      set((state) => ({
        hotelList: state.hotelList.filter((hotel) => hotel._id !== hotelId),
      }));
      return res.data.message;
    } catch (error) {
      console.error("Gagal hapus hotel:", error);
      set({ isError: "Gagal hapus hotel" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useStoreHotel;
