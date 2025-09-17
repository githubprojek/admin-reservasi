import React, { useEffect, useState, useRef } from "react";
import { useStoreReservasi } from "./useStoreReservasi.js";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfrimModal.jsx";

const Reservasi = () => {
  const { fetchReservasi, reservasiList, deleteReservasi, user, checkStatusPembayaran } = useStoreReservasi();
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservasi();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      // filter hanya reservasi dengan status "pending"
      const pendingList = reservasiList.filter((item) => item.paymentStatus === "pending");
      for (const reservasi of pendingList) {
        try {
          await checkStatusPembayaran(reservasi._id); // panggil API cek status
        } catch (err) {
          console.error("Gagal cek status pembayaran:", err);
        }
      }
    }, 1000000); // cek setiap 10 detik

    return () => clearInterval(interval);
  }, [reservasiList, checkStatusPembayaran]);

  const handleConfirmDelete = async () => {
    if (selectedReservasi) {
      const result = await deleteReservasi(selectedReservasi._id);
      if (result) {
        alert(result);
      } else {
        alert("Gagal hapus reservasi!");
      }
      setSelectedReservasi(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const formatCurrency = (num) => num?.toLocaleString("id-ID", { style: "currency", currency: "IDR" }) || "-";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredList = reservasiList.filter((item) => {
    const matchesName = item.guestName.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus = statusFilter ? item.statusReservasi === statusFilter : true;

    const checkIn = new Date(item.checkIn);
    const checkOut = new Date(item.checkOut);

    let matchesDate = true;
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      matchesDate = checkIn >= startDate || checkOut >= startDate;
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      matchesDate = matchesDate && (checkIn <= endDate || checkOut <= endDate);
    }

    return matchesName && matchesStatus && matchesDate;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reservasi</h1>
        <button onClick={() => navigate("/reservasi/add-reservasi")} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
          <Plus size={18} />
          Tambah Reservasi
        </button>
      </div>

      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 items-center border p-4 rounded-lg bg-gray-50">
        <input type="text" placeholder="Cari nama tamu..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border px-3 py-2 rounded w-48 text-sm" />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded text-sm">
          <option value="">Semua Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked-In</option>
          <option value="checked-out">Checked-Out</option>
        </select>

        <div className="flex flex-col sm:flex-row gap-2">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="border px-3 py-2 rounded text-sm" />
          <span className="hidden sm:inline">-</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="border px-3 py-2 rounded text-sm" />
        </div>
      </div>

      {filteredList.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada data reservasi.</p>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <div>
                <p className="font-semibold text-gray-800">
                  {item.guestName} &bull; {item.guestPhone}
                </p>
                <p className="text-gray-600 text-sm">{item.guestEmail}</p>
                <p className="text-gray-600 text-sm">
                  {item?.hotel?.nama_hotel || "-"} &mdash; {item?.room?.jenis_room || "-"} &bull; {item.jumlahKamar} Kamar &bull; {item.jumlahTamu} Tamu
                </p>
                <p className="text-gray-500 text-sm">
                  {formatDate(item.checkIn)} &rarr; {formatDate(item.checkOut)}
                </p>
                <p className="text-gray-700 text-sm font-medium">{formatCurrency(item.totalPrice)}</p>
                <div className="mt-1 text-xs text-gray-500">
                  Status: <span className="font-semibold">{item.statusReservasi}</span> | Payment: <span className="font-semibold">{item.paymentStatus}</span>
                </div>
                {item.keterangan && <p className="mt-1 text-gray-500 text-xs italic">"{item.keterangan}"</p>}
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <button onClick={() => navigate(`/reservasi/update-reservasi/${item._id}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReservasi(item);
                    setMenuOpenId(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!selectedReservasi} title="Hapus Reservasi" description={`Yakin ingin menghapus reservasi "${selectedReservasi?.guestName}"?`} onCancel={() => setSelectedReservasi(null)} onConfirm={handleConfirmDelete} />
    </div>
  );
};

export default Reservasi;
