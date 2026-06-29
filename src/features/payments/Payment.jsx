import { useEffect } from "react";
import { useStoreReservasi } from "../reservasi/useStoreReservasi.js";

const Payment = () => {
  const { reservasiList, fetchReservasi } = useStoreReservasi();

  useEffect(() => {
    fetchReservasi();
  }, [fetchReservasi]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">History Reservasi</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">No</th>
              <th className="px-6 py-4 text-sm font-semibold">Atas Nama</th>
              <th className="px-6 py-4 text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-sm font-semibold">Payment</th>
              <th className="px-6 py-4 text-sm font-semibold">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservasiList.length > 0 ? (
              reservasiList.map((item, idx) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4">{item?.guestName || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item?.paymentStatus === "Paid" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{item?.paymentStatus || "-"}</span>
                  </td>
                  <td className="px-6 py-4">{item?.paymentMethod || "-"}</td>
                  <td className="px-6 py-4 font-semibold">Rp. {Number(item?.totalPrice).toLocaleString("id-ID")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">
                  Belum ada data Reservasi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
