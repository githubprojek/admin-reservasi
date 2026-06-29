import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const createAxiosInstance = (prefix) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/${prefix}`,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const axiosAuth = createAxiosInstance("auth");
export const axiosHotel = createAxiosInstance("hotel");
export const axiosReservasi = createAxiosInstance("reservasi");
export const axiosRoom = createAxiosInstance("room");
export const axiosCheckout = createAxiosInstance("checkout");
export const axiosFasilitas = createAxiosInstance("fasilitas");
