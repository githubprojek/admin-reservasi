import { useEffect } from "react";
import { useStoreReservasiHistory } from "./useStoreReservasiHistory.js";

const HistoryReservasi = () => {
  const { fetchCheckout, checkoutList } = useStoreReservasiHistory();

  useEffect(() => {
    fetchCheckout();
  }, [fetchCheckout]); // dependensi best practice

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">History Reservasi</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3">No</th>
              <th className="py-3">Nama Tamu</th>
              <th className="py-3">Nama Hotel</th>
              <th className="py-3">Check Out</th>
              <th className="py-3">Tanggal Arsip</th>
            </tr>
          </thead>
          <tbody>
            {checkoutList.length > 0 ? (
              checkoutList.map((item, idx) => (
                <tr key={item._id} className="odd:bg-white even:bg-gray-100">
                  <td className="py-2">{idx + 1}</td>
                  <td>{item?.guestName || "-"}</td>
                  <td>{item?.hotel?.nama_hotel || "-"}</td>
                  <td>{formatDate(item?.checkOut)}</td>
                  <td>{formatDate(item?.archivedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-gray-400 italic">
                  Belum ada data reservasi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryReservasi;
