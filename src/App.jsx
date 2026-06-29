import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./features/dashboard/Dashboard";
import Hotel from "./features/hotel/Hotel";
import AddHotel from "./features/hotel/AddHotel";
import UpdateHotel from "./features/hotel/UpdateHotel";
import DetailHotel from "./features/hotel/DetailHotel";
import Room from "./features/room/Room";
import AddRoom from "./features/room/AddRoom";
import UpdateRoom from "./features/room/UpdateRoom";
import DetailRoom from "./features/room/DetailRoom";
import Reservasi from "./features/reservasi/Reservasi";
import AddReservasi from "./features/reservasi/AddReservasi";
import UpdateReservasi from "./features/reservasi/UpdateReservasi";
import HistoryReservasi from "./features/reservasi/HistoryReservasi";
import Payment from "./features/payments/Payment";
import Fasilitas from "./features/fasilitas/Fasilitas";
import Staff from "./features/auth/Staff";
import AddStaff from "./features/auth/AddStaff";
import UpdateStaff from "./features/auth/updateStaff";
import Login from "./features/auth/Login";
import { useEffect } from "react";
import { useAuthStore } from "./features/auth/useStoreAuth";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader className="h-10 w-10 animate-spin" strokeWidth={2} />
  //     </div>
  //   );
  // }

  return (
    <Routes>
      {/* Login route tidak diproteksi */}
      <Route path="/login" element={<Login />} />
      {/* Semua route CMS dibungkus ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/add-staff" element={<AddStaff />} />
          <Route path="staff/update-staff" element={<UpdateStaff />} />
          <Route path="hotel" element={<Hotel />} />
          <Route path="hotel/add-hotel" element={<AddHotel />} />
          <Route path="hotel/update-hotel" element={<UpdateHotel />} />
          <Route path="hotel/detail-hotel/:id" element={<DetailHotel />} />
          <Route path="room" element={<Room />} />
          <Route path="room/add-room" element={<AddRoom />} />
          <Route path="room/update-room" element={<UpdateRoom />} />
          <Route path="room/detail-room/:id" element={<DetailRoom />} />
          <Route path="reservasi" element={<Reservasi />} />
          <Route path="reservasi/add-reservasi" element={<AddReservasi />} />
          <Route path="reservasi/update-reservasi/:id" element={<UpdateReservasi />} />
          <Route path="historyReservasi" element={<HistoryReservasi />} />
          <Route path="payments" element={<Payment />} />
          <Route path="fasilitas" element={<Fasilitas />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
