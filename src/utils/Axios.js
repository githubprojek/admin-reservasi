import axios from "axios";

const BASE_URL = ["http://localhost:5000", "https://be-reservasi.vercel.app/"];

const createAxiosInstance = (prefix) => {
  return axios.create({
    baseURL: `${BASE_URL}/${prefix}`,
    withCredentials: true,
  });
};

// Export semua instance
export const axiosAuth = createAxiosInstance("auth");
export const axiosHotel = createAxiosInstance("hotel");
export const axiosReservasi = createAxiosInstance("reservasi");
export const axiosRoom = createAxiosInstance("room");
export const axiosCheckout = createAxiosInstance("checkout");
export const axiosFasilitas = createAxiosInstance("fasilitas");
