// src/store/dashboard/useDashboardStore.js

import { create } from "zustand";
import { useAuthStore } from "../auth/useStoreAuth.js";
import useStoreRoom from "../room/useStoreRoom.js";
import useStoreReservasi from "../reservasi/useStoreReservasi.js";
import useStoreHotel from "../hotel/useStoreHotel.js";
import useStoreReservasiHistory from "../reservasi/useStoreReservasiHistory.js"; // ✅ Tambahkan ini

export const useDashboardStore = create((set, get) => ({
  loading: false,
  error: null,

  stats: {
    totalStaff: 0,
    totalRoom: 0,
    totalReservasi: 0,
    totalHotel: 0,
  },

  historyCheckoutList: [], // ✅ Tambahkan state baru

  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      // Ambil semua store state
      const authStore = useAuthStore.getState();
      const roomStore = useStoreRoom.getState();
      const reservasiStore = useStoreReservasi.getState();
      const hotelStore = useStoreHotel.getState();
      const reservasiHistoryStore = useStoreReservasiHistory.getState(); // ✅

      // Fetch data paralel
      await Promise.all([
        authStore.getStaff(),
        roomStore.fetchRoom(true),
        reservasiStore.fetchReservasi(),
        hotelStore.fetchHotel(true),
        reservasiHistoryStore.fetchCheckout(), // ✅ Panggil
      ]);

      // Ambil hasil data
      const totalStaff = authStore.staffList?.length || 0;
      const totalRoom = roomStore.roomList?.length || 0;
      const totalReservasi = reservasiStore.reservasiList?.length || 0;
      const totalHotel = hotelStore.hotelList?.length || 0;
      const historyCheckoutList = reservasiHistoryStore.checkoutList || []; // ✅

      // Simpan ke store
      set({
        stats: {
          totalStaff,
          totalRoom,
          totalReservasi,
          totalHotel,
        },
        historyCheckoutList,
      });
    } catch (error) {
      console.error("❌ Gagal fetch dashboard:", error);
      set({ error: "Gagal mengambil data dashboard" });
    } finally {
      set({ loading: false });
    }
  },
}));
