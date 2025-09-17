import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreRoom } from "./useStoreRoom";
import Spinner from "../../components/Spinner";
import { ChevronLeft } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const DetailRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roomList, getRoomDetail } = useStoreRoom();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const DetailItem = ({ label, value }) => (
    <div className="min-w-[200px]">
      <h2 className="text-lg font-semibold text-gray-700 mb-1">{label}</h2>
      <p className="text-gray-600">{value}</p>
    </div>
  );

  useEffect(() => {
    const found = roomList.find((r) => r._id === id);
    if (found) {
      setRoom(found);
    } else {
      setLoading(true);
      getRoomDetail(id)
        .then((res) => setRoom(res))
        .finally(() => setLoading(false));
    }
  }, [id, roomList]);

  if (!room || loading) return <Spinner message="Memuat detail room..." />;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>

      <h1 className="text-4xl font-bold text-gray-800">{room?.nameRoom || "-"}</h1>

      <div className="w-full">
        {room?.image_room && room.image_room.length > 0 ? (
          <Carousel showThumbs={true} showStatus={false} infiniteLoop className="rounded-xl overflow-hidden">
            {room.image_room.map((url, idx) => (
              <div key={idx}>
                <img src={url} alt={`Room ${idx + 1}`} className="w-full max-h-[500px] object-cover" />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="text-gray-400 italic">Tidak ada foto tersedia.</div>
        )}
      </div>

      <div className="bg-white shadow rounded-xl p-6 flex flex-wrap gap-5 mb-5">
        <DetailItem label="Jenis Room" value={room?.jenis_room || "-"} />
        <DetailItem label="Harga" value={`Rp ${Number(room?.harga_room).toLocaleString("id-ID")}`} />
        <DetailItem label="Tipe Kasur" value={room?.bed_type} />
        <DetailItem label="Kapasitas" value={`${room?.kapasitas} orang`} />
        <DetailItem label="Luas" value={`${room?.luas} m²`} />
        <DetailItem label="Jumlah Kamar" value={room?.jumlah_room} />
        <DetailItem label="Available" value={room?.availableRoom ?? "-"} />
        <DetailItem label="Booked" value={room?.bookedCount ?? "-"} />

        <div className="min-w-[200px]">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Fasilitas</h2>
          {room?.fasilitas_room?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {room.fasilitas_room.map((fasilitas, idx) => (
                <li key={idx}>{fasilitas?.name || "-"}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Tidak ada fasilitas ditambahkan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailRoom;
