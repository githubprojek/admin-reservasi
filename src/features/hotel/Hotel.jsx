import { useEffect, useState, useRef } from "react";
import { useStoreHotel } from "./useStoreHotel.js";
import { Plus, Trash2, Pencil, ImageIcon, MoreVertical } from "lucide-react";
import Spinner from "../../components/Spinner";
import ConfirmModal from "../../components/ConfrimModal.jsx";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/useStoreAuth.js";

const Hotel = () => {
  const { user } = useAuthStore();
  const { fetchHotel, hotelList, deleteHotel, isLoading, isError } = useStoreHotel();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  const handleAddHotel = () => {
    navigate("/hotel/add-hotel");
  };

  const handleUpdateHotel = (hotel) => {
    navigate("/hotel/update-hotel", { state: hotel });
  };

  const handleConfirmDelete = async () => {
    if (selectedHotel) {
      const result = await deleteHotel(selectedHotel._id);
      if (result) {
        alert(result);
      } else {
        alert("Gagal hapus hotel!");
      }
      setSelectedHotel(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isLoading && <Spinner message="Memuat data hotel..." />}

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Hotel</h1>
        </div>

        {isError && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">{isError}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* CARD TAMBAH HOTEL */}
          {user?.role === "Super Admin" && (
            <div
              onClick={handleAddHotel}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden flex flex-col justify-center items-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition relative h-60"
            >
              <div className="flex flex-col items-center justify-center h-full w-full">
                <Plus size={40} className="text-blue-600 mb-2" />
                <span className="text-lg font-medium text-blue-600">Tambah Hotel</span>
              </div>
            </div>
          )}

          {hotelList.length > 0 ? (
            hotelList.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => navigate(`/hotel/detail-hotel/${hotel._id}`)}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden flex flex-col border border-gray-100 transition relative"
              >
                <div className="h-40 w-full bg-gray-100 overflow-hidden relative group">
                  {hotel.image_hotel && hotel.image_hotel.length > 0 ? (
                    <img src={hotel.image_hotel[0]} alt={hotel.nama_hotel} className="w-full h-full object-cover transform group-hover:scale-105 transition" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-sm">Tidak ada foto</span>
                    </div>
                  )}

                  {/* Tombol titik tiga */}
                  <div ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === hotel._id ? null : hotel._id);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/70 backdrop-blur hover:bg-white shadow text-gray-600"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {menuOpenId === hotel._id && (
                      <div className="absolute top-12 right-4 bg-gray-100 rounded shadow-md z-30 w-32 text-left cursor-pointer">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateHotel(hotel);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHotel(hotel);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 size={16} /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">{hotel.nama_hotel}</h2>
                    <p className="text-gray-500 text-sm">{hotel.kota_hotel}</p>
                    <p className="text-gray-400 text-xs mt-1">{hotel.alamat_hotel}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 italic text-center py-12 col-span-full">Belum ada data hotel.</div>
          )}
        </div>
      </div>

      {/* Modal Hapus */}
      <ConfirmModal open={!!selectedHotel} title="Hapus Hotel" description={`Yakin ingin menghapus hotel "${selectedHotel?.nama_hotel}"?`} onCancel={() => setSelectedHotel(null)} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Hotel;
