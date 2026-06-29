import { useEffect, useState } from "react";
import { useStoreReservasi } from "./useStoreReservasi";
import useStoreHotel from "../hotel/useStoreHotel.js";
import useStoreRoom from "../room/useStoreRoom.js";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AddReservasi = () => {
  const navigate = useNavigate();
  const { createReservasi, loading } = useStoreReservasi();
  const { hotelList, fetchHotel, isLoading: hotelLoading } = useStoreHotel();
  const { roomList, fetchRoom, loading: roomLoading } = useStoreRoom();

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    hotel: "",
    room: "",
    jumlahTamu: 1,
    jumlahKamar: 1,
    checkIn: "",
    checkOut: "",
    keterangan: "",
  });

  // ✅ Panggil store hooks di awal
  useEffect(() => {
    fetchHotel();
    fetchRoom();
  }, [fetchHotel, fetchRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jumlahTamu" || name === "jumlahKamar") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createReservasi(formData);
    if (!res.error) {
      navigate("/reservasi");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mb-5">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 mb-6 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>
      <h1 className="text-2xl font-bold mb-4">Tambah Reservasi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Tamu</label>
          <input name="guestName" value={formData.guestName} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" required type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium">Telepon</label>
            <input name="guestPhone" value={formData.guestPhone} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Pilih Hotel</label>
            <select name="hotel" value={formData.hotel} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" required>
              <option value="">-- Pilih Hotel --</option>
              {hotelList.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.nama_hotel}
                </option>
              ))}
            </select>
            {hotelLoading && <p className="text-xs text-gray-500">Memuat hotel...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Pilih Room</label>
            <select name="room" value={formData.room} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" required>
              <option value="">-- Pilih Room --</option>
              {roomList
                .filter((r) => r.jumlah_room > 0) // cuma tampilkan yang masih ada stok
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.jenis_room}
                  </option>
                ))}
            </select>

            {roomLoading && <p className="text-xs text-gray-500">Memuat room...</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Jumlah Tamu</label>
            <input name="jumlahTamu" value={formData.jumlahTamu} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" type="number" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Jumlah Kamar</label>
            <input name="jumlahKamar" value={formData.jumlahKamar} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" type="number" min="1" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Check In</label>
            <input name="checkIn" value={formData.checkIn} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" type="datetime-local" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Check Out</label>
            <input name="checkOut" value={formData.checkOut} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2" type="datetime-local" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Keterangan</label>
          <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} className="bg-white w-full border rounded px-3 py-2"></textarea>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {loading ? "Menyimpan..." : "Simpan Reservasi"}
        </button>
      </form>
    </div>
  );
};

export default AddReservasi;
