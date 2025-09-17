import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreReservasi } from "./useStoreReservasi";
import { ChevronLeft } from "lucide-react";

const UpdateReservasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getReservasiById, updateReservasi, checkInReservasi, checkOutReservasi } = useStoreReservasi();

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    jumlahTamu: 1,
    jumlahKamar: 1,
    checkIn: "",
    checkOut: "",
    totalPrice: "",
    keterangan: "",
    statusReservasi: "",
  });

  useEffect(() => {
    if (id) {
      getReservasiById(id).then((res) => {
        if (res) {
          setForm({
            guestName: res.guestName || "",
            guestEmail: res.guestEmail || "",
            guestPhone: res.guestPhone || "",
            jumlahTamu: Number(res.jumlahTamu) || 1,
            jumlahKamar: Number(res.jumlahKamar) || 1,
            checkIn: res.checkIn ? res.checkIn.slice(0, 10) : "",
            checkOut: res.checkOut ? res.checkOut.slice(0, 10) : "",
            totalPrice: res.totalPrice || "",
            keterangan: res.keterangan || "",
            statusReservasi: res.statusReservasi || "",
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jumlahTamu" || name === "jumlahKamar") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { totalPrice, ...payload } = form;

    const result = await updateReservasi(id, payload);
    if (!result.error) {
      navigate("/reservasi");
    }
  };

  const handleCheckIn = async () => {
    const result = await checkInReservasi(id);
    if (!result.error) {
      navigate("/reservasi");
    }
  };

  const handleCheckOut = async () => {
    const result = await checkOutReservasi(id);
    if (!result.error) {
      navigate("/reservasi");
    }
  };

  const formatCurrency = (num) => num?.toLocaleString("id-ID", { style: "currency", currency: "IDR" }) || "-";

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mb-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Update Reservasi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nama Tamu" name="guestName" value={form.guestName} onChange={handleChange} />
          <Input label="Email Tamu" name="guestEmail" value={form.guestEmail} onChange={handleChange} />
          <Input label="No Telepon" name="guestPhone" value={form.guestPhone} onChange={handleChange} />
          <Input label="Jumlah Tamu" name="jumlahTamu" value={form.jumlahTamu} onChange={handleChange} type="number" min="1" />
          <Input label="Jumlah Kamar" name="jumlahKamar" value={form.jumlahKamar} onChange={handleChange} type="number" min="1" />
          <Input label="Tanggal Check In" name="checkIn" value={form.checkIn} onChange={handleChange} type="date" />
          <Input label="Tanggal Check Out" name="checkOut" value={form.checkOut} onChange={handleChange} type="date" />

          {/* Status dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Reservasi</label>
            <select
              name="statusReservasi"
              value={form.statusReservasi}
              onChange={handleChange}
              className="bg-white w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked-In</option>
              <option value="checked-out">Checked-Out</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Harga (IDR)</label>
            <p className="bg-gray-100 w-full border border-gray-300 rounded-lg px-3 py-2">{formatCurrency(form.totalPrice)}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
          <textarea
            name="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            className="bg-white w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="3"
            placeholder="Keterangan tambahan"
          ></textarea>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 transition text-white font-bold rounded-lg">
            Simpan Perubahan
          </button>

          {/* Tombol khusus check-in dan check-out */}
          <button type="button" onClick={handleCheckIn} className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 transition text-white font-bold rounded-lg">
            Check-In
          </button>

          <button type="button" onClick={handleCheckOut} className="w-full flex items-center justify-center gap-2 py-4 bg-yellow-600 hover:bg-yellow-700 transition text-white font-bold rounded-lg">
            Check-Out
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="bg-white w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
  </div>
);

export default UpdateReservasi;
