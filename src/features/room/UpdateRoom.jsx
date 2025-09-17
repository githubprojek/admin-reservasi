import React, { useState, useEffect } from "react";
import { useStoreRoom } from "./useStoreRoom";
import { useStoreHotel } from "../hotel/useStoreHotel";
import { useStoreFasilitas } from "../fasilitas/useStoreFasilitas";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, Save, X, ChevronLeft } from "lucide-react";

const UpdateRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRoom } = useStoreRoom();
  const { fetchHotel, hotelList } = useStoreHotel();
  const { fetchFasilitas, fasilitasList } = useStoreFasilitas();

  const oldRoom = location.state;

  const [form, setForm] = useState({
    hotel: "",
    nameRoom: "",
    jenis_room: "",
    harga_room: "",
    jumlah_room: "",
    bed_type: "",
    kapasitas: "",
    luas: "",
    fasilitas_room: [],
    image_room: [],
  });

  const [hargaDisplay, setHargaDisplay] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Helper format Rupiah
  const formatRupiah = (value) => {
    if (!value) return "";
    const num = parseInt(value.toString().replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) return "";
    return "Rp. " + num.toLocaleString("id-ID");
  };

  useEffect(() => {
    if (oldRoom) {
      setForm({
        hotel: oldRoom.hotel?._id || "",
        nameRoom: oldRoom.nameRoom,
        jenis_room: oldRoom.jenis_room,
        harga_room: oldRoom.harga_room,
        jumlah_room: oldRoom.jumlah_room,
        bed_type: oldRoom.bed_type,
        kapasitas: oldRoom.kapasitas,
        luas: oldRoom.luas,
        fasilitas_room: oldRoom.fasilitas_room?.map((f) => (typeof f === "object" ? f._id : f)) || [],
        image_room: [],
      });
      setExistingImages(oldRoom.image_room || []);
      setHargaDisplay(formatRupiah(oldRoom.harga_room));
    }
  }, [oldRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHargaChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setForm((prev) => ({
      ...prev,
      harga_room: rawValue,
    }));
    setHargaDisplay(formatRupiah(rawValue));
  };

  const handleCheckboxChange = (id) => {
    setForm((prev) => {
      const already = prev.fasilitas_room.includes(id);
      return {
        ...prev,
        fasilitas_room: already ? prev.fasilitas_room.filter((fid) => fid !== id) : [...prev.fasilitas_room, id],
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      image_room: [...prev.image_room, ...files],
    }));
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      image_room: prev.image_room.filter((_, i) => i !== idx),
    }));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotel", form.hotel);
    formData.append("nameRoom", form.nameRoom);
    formData.append("jenis_room", form.jenis_room);
    formData.append("harga_room", Number(form.harga_room));
    formData.append("jumlah_room", Number(form.jumlah_room));
    formData.append("bed_type", form.bed_type);
    formData.append("kapasitas", Number(form.kapasitas));
    formData.append("luas", Number(form.luas));
    formData.append("fasilitas_room", JSON.stringify(form.fasilitas_room));

    form.image_room.forEach((file) => {
      formData.append("image_room", file);
    });

    const removeImages = oldRoom.image_room.filter((url) => !existingImages.includes(url));
    formData.append("remove_images", JSON.stringify(removeImages));

    try {
      await updateRoom(oldRoom._id, formData);
      alert("Room berhasil diperbarui!");
      navigate("/room");
    } catch (err) {
      console.error(err);
      alert("Gagal update room.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mb-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Update Room</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hotel */}
        <div>
          <label className="block text-sm font-semibold mb-1">Hotel</label>
          <select name="hotel" value={form.hotel} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-3 focus:ring-blue-500" required>
            <option value="">-- Pilih Hotel --</option>
            {hotelList.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.nama_hotel}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Room */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name Room</label>
          <input type="text" name="nameRoom" value={form.nameRoom} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Jenis Room</label>
          <select name="jenis_room" value={form.jenis_room} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-3 focus:ring-blue-500" required>
            <option value="">-- Pilih Jenis Room --</option>
            <option value="Standard">Standard</option>
            <option value="Superior">Superior</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Family">Family</option>
          </select>
        </div>

        {/* Grid input */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Harga Room</label>
            <input type="text" name="harga_room" value={hargaDisplay} onChange={handleHargaChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Jumlah</label>
            <input type="number" name="jumlah_room" value={form.jumlah_room} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Kapasitas</label>
            <input type="number" name="kapasitas" value={form.kapasitas} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Luas (m²)</label>
            <input type="number" name="luas" value={form.luas} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Bed Type */}
        <div>
          <label className="block text-sm font-semibold mb-1">Tipe Kasur</label>
          <select name="bed_type" value={form.bed_type} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-3 focus:ring-blue-500" required>
            <option value="">-- Pilih Tipe Kasur --</option>
            <option value="King">King</option>
            <option value="Queen">Queen</option>
            <option value="Twin">Twin</option>
            <option value="Single">Single</option>
          </select>
        </div>

        {/* Fasilitas */}
        <div>
          <label className="block text-sm font-semibold mb-2">Fasilitas Room</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fasilitasList.map((fasilitas) => (
              <label key={fasilitas._id} className="flex items-center space-x-2">
                <input type="checkbox" checked={form.fasilitas_room.includes(fasilitas._id)} onChange={() => handleCheckboxChange(fasilitas._id)} className="accent-blue-600" />
                <span>{fasilitas.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Foto Room Baru */}
        <div>
          <label className="block text-sm font-semibold mb-2">Foto Room Baru</label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50 transition">
            <Upload className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-gray-500 text-sm">Klik untuk memilih gambar baru</span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-md shadow" />
                  <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Foto Lama */}
        {existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-semibold mb-2">Foto Room Lama</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Existing ${idx}`} className="w-full h-32 object-cover rounded-md shadow" />
                  <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Submit */}
        <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-md">
          <Save className="w-5 h-5" /> Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default UpdateRoom;
