import { axiosFasilitas } from "../../utils/Axios";
import { create } from "zustand";

export const useStoreFasilitas = create((set, get) => ({
  fasilitasList: [],

  fetchFasilitas: async () => {
    try {
      const res = await axiosFasilitas.get("/getFasilitas");
      set({ fasilitasList: res.data.fasilitas });
      console.log(fasilitas);
    } catch (error) {
      console.log(error);
    }
  },

  addFasilitas: async (fasilitasData) => {
    try {
      const res = await axiosFasilitas.post("/createfasilitas", fasilitasData);
      set((state) => ({
        fasilitasList: [...state.fasilitasList, res.data],
      }));
      await get().fetchFasilitas();
    } catch (error) {
      console.error("Add fasilitas error:", error);
    }
  },

  deletefasilitas: async (fasilitasId) => {
    try {
      const res = await axiosFasilitas.delete(`/deleteFasilitas/${fasilitasId}`);
      set((state) => ({
        fasilitasList: state.fasilitasList.filter((fasilitas) => fasilitas._id !== fasilitasId),
      }));
      return res.data.message; // 🔥 Return pesan
    } catch (error) {
      console.error("Gagal hapus fasilitas:", error);
      return null; // 🔥 Return null biar catch ga keburu throw
    }
  },
}));

export default useStoreFasilitas;
