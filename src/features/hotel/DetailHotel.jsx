import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreHotel } from "./useStoreHotel";
import Spinner from "../../components/Spinner";
import { ChevronLeft } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHotelDetail, isLoading, isError } = useStoreHotel();
  const [hotel, setHotel] = useState(null);

  const InfoItem = ({ label, value }) => (
    <div className="min-w-[200px]">
      <h2 className="text-lg font-semibold text-gray-700 mb-1">{label}</h2>
      <p className="text-gray-600">{value}</p>
    </div>
  );

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getHotelDetail(id);
      setHotel(data);
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <Spinner message="Memuat detail hotel..." />;
  if (isError) return <div className="text-red-600 p-6">{isError}</div>;
  if (!hotel) return <div className="text-gray-500 p-6">Hotel tidak ditemukan.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 mb-10">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>

      <h1 className="text-4xl font-bold text-gray-800">{hotel.nama_hotel}</h1>

      {/* Carousel full width */}
      <div className="w-full">
        {hotel.image_hotel && hotel.image_hotel.length > 0 ? (
          <Carousel showThumbs={true} showStatus={false} infiniteLoop className="rounded-xl overflow-hidden">
            {hotel.image_hotel.map((url, idx) => (
              <div key={idx}>
                <img src={url} alt={`${hotel.nama_hotel} ${idx + 1}`} className="w-full max-h-[500px] object-cover" />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="text-gray-400 italic">Tidak ada foto tersedia.</div>
        )}
      </div>

      {/* Info horizontal */}
      <div className="bg-white shadow rounded-xl p-6 flex flex-wrap gap-8">
        <InfoItem label="Alamat" value={hotel.alamat_hotel} />
        <InfoItem label="Kota" value={hotel.kota_hotel} />
        <InfoItem label="Email" value={hotel.email_hotel || "-"} />
        <InfoItem label="No. Telepon" value={hotel.notelp_hotel || "-"} />
      </div>
    </div>
  );
};

export default HotelDetail;
