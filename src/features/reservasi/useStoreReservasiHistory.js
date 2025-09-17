import { axiosReservasi } from "../../utils/Axios.js";
import { create } from "zustand";

export const useStoreReservasiHistory = create((set, get) => ({
  checkoutList: [],

  fetchCheckout: async () => {
    try {
      const res = await axiosReservasi.get("/getCheckout");
      set({ checkoutList: res.data.history });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useStoreReservasiHistory;
