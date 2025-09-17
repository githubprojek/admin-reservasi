// Room.jsx
import React, { useEffect, useState, useRef } from "react";
import { useStoreRoom } from "./useStoreRoom.js";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfrimModal.jsx";
import Spinner from "../../components/Spinner.jsx";
import { useStoreHotel } from "../hotel/useStoreHotel.js";
import { useAuthStore } from "../auth/useStoreAuth.js";

const Room = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const { fetchHotel, hotelList } = useStoreHotel();
  const { user } = useAuthStore();
  const { fetchRoom, roomList, deleteRoom, loading, error, availableRoom, fetchAvailableRooms } = useStoreRoom();
  const navigate = useNavigate();
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searched, setSearched] = useState(false);
  const menuRef = useRef(null);
  const menuRefs = useRef({});

  useEffect(() => {
    fetchRoom();
    fetchHotel();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = Object.values(menuRefs.current).some((ref) => ref && ref.contains(event.target));
      if (!isClickInside) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    const hotelId = hotelList[0]?._id;

    if (!hotelId || !checkIn || !checkOut) {
      return alert("Isi hotel, check-in, dan check-out dulu");
    }

    console.log(hotelId, checkIn, checkOut);

    await fetchAvailableRooms(hotelId, checkIn, checkOut);
    console.log(fetchAvailableRooms);
    setSearched(true);
  };

  const handleAddRoom = () => navigate("/room/add-room");
  const handleOpenDetail = (room) => navigate(`/room/detail-room/${room._id}`);
  const handleEdit = (room) => {
    navigate("/room/update-room", { state: room });
    setMenuOpenId(null);
  };
  const handleAskDelete = (room) => {
    setSelectedRoom(room);
    setMenuOpenId(null);
  };
  const handleConfirmDelete = async () => {
    if (selectedRoom) {
      await deleteRoom(selectedRoom._id);
      setSelectedRoom(null);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Manajemen Room</h1>

        {loading && <Spinner message="Memuat data room..." />}
        {error && <p className="text-red-600">{error}</p>}

        {/* Input tanggal */}
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row sm:items-end gap-4 mb-6 border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <button onClick={handleSearch} className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition">
              Cari
            </button>
          </div>
        </div>

        {/* Card room muncul HANYA setelah cari */}
        {/* Hasil pencarian */}
        {searched ? (
          availableRoom && availableRoom.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user?.role === "Super Admin" && (
                <div onClick={handleAddRoom} className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-blue-400 rounded-lg p-6 hover:bg-blue-50 transition">
                  <Plus size={36} className="text-blue-500 mb-2" />
                  <span className="text-blue-600 font-medium">Tambah Room</span>
                </div>
              )}

              {availableRoom.map((item) => (
                <div key={item._id} ref={(el) => (menuRefs.current[item._id] = el)} className="bg-white shadow rounded-lg p-4 relative cursor-pointer hover:ring-2 hover:ring-blue-100 transition" onClick={() => handleOpenDetail(item)}>
                  <h2 className="text-lg font-semibold mb-2">{item?.nameRoom || "-"}</h2>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Jenis Kamar :</span> {item?.jenis_room || "-"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Harga :</span> Rp {Number(item?.harga_room).toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Jumlah Room :</span> {item.jumlah_room}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Available :</span> {item?.availableRoom ?? "-"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Total Reservasi :</span> {item?.bookedCount ?? "-"}
                  </p>

                  {/* Menu edit/hapus */}
                  <div ref={menuRef}>
                    <button
                      className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId((prev) => (prev === item._id ? null : item._id));
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {menuOpenId === item._id && (
                      <div className="absolute top-12 right-4 bg-gray-100 border-none rounded shadow-md z-20 w-32 text-left cursor-p">
                        <button
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAskDelete(item);
                          }}
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Tidak ada room tersedia di tanggal ini.</p>
          )
        ) : (
          <p className="text-gray-600">Isi tanggal check-in dan check-out untuk melihat room tersedia.</p>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal open={!!selectedRoom} title="Hapus Room" description={`Yakin ingin menghapus room "${selectedRoom?.jenis_room}"?`} onCancel={() => setSelectedRoom(null)} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Room;
