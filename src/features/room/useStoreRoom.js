// useStoreRoom.js
import { create } from "zustand";
import { axiosRoom } from "../../utils/Axios";

export const useStoreRoom = create((set, get) => ({
  roomList: [],
  availableRoom: [],
  loading: false,
  error: null,
  isFetched: false, // 🔥 Tambahan flag

  fetchRoom: async (force = false) => {
    // 🔑 Kalau sudah pernah fetch & tidak dipaksa, skip refetch
    if (get().isFetched && !force) {
      console.log("✅ Data room sudah di-cache, tidak refetch");
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await axiosRoom.get("/getRoom");
      set({
        roomList: res.data.content.rooms,
        isFetched: true, // 🔥 Tandai sudah pernah fetch
      });
    } catch (error) {
      console.error(error);
      set({ error: "Gagal memuat data room" });
    } finally {
      set({ loading: false });
    }
  },

  addRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosRoom.post("/createRoom", roomData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ⛔ Jangan push manual ke roomList
      // ✅ Refetch biar bookedCount & availableRoom fresh
      await get().fetchRoom(true);

      return res.data;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal menambah room" });
      return { error: true };
    } finally {
      set({ loading: false });
    }
  },

  getRoomDetail: async (roomId) => {
    set({ isLoading: true, isError: null });
    try {
      const res = await axiosRoom.get(`/getRoomById/${roomId}`);
      return res.data.room;
    } catch (error) {
      console.error("Gagal ambil detail room:", error);
      set({ isError: "Gagal ambil detail room." });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRoom: async (roomId, updateRoomData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosRoom.put(`/updateRoom/${roomId}`, updateRoomData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🔥 Daripada patch local state,
      // panggil fetchRoom() supaya bookedCount & availableRoom benar.
      await get().fetchRoom(true); // force refetch

      return res.data.room;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal update room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRoom: async (roomId) => {
    set({ loading: true, error: null });
    try {
      await axiosRoom.delete(`/deleteRoom/${roomId}`);
      set((state) => ({
        roomList: state.roomList.filter((room) => room._id !== roomId),
      }));
      return true;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal hapus room" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchAvailableRooms: async (hotelId, checkIn, checkOut) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosRoom.get("/getAvailable", {
        params: { hotelId, checkIn, checkOut },
      });
      set({ availableRoom: res.data.content.rooms });
      return res.data.content.rooms;
    } catch (error) {
      console.error(error);
      set({ error: "Gagal memuat room tersedia" });
      return [];
    } finally {
      set({ loading: false });
    }
  },
}));

export default useStoreRoom;
