import React, { useState } from "react";
import { useStoreHotel } from "./useStoreHotel.js";
import { Upload, PlusCircle, X, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const { addHotel, isLoading, isError } = useStoreHotel();

  const navigasi = useNavigate();

  const [form, setForm] = useState({
    nama_hotel: "",
    alamat_hotel: "",
    kota_hotel: "",
    email_hotel: "",
    notelp_hotel: "",
    image_hotel: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Tambahkan file ke list lama
    setForm((prev) => ({
      ...prev,
      image_hotel: [...prev.image_hotel, ...files],
    }));

    // Generate URL preview & gabungkan
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      image_hotel: prev.image_hotel.filter((_, i) => i !== idx),
    }));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_hotel", form.nama_hotel);
    formData.append("alamat_hotel", form.alamat_hotel);
    formData.append("kota_hotel", form.kota_hotel);
    formData.append("email_hotel", form.email_hotel);
    formData.append("notelp_hotel", form.notelp_hotel);

    form.image_hotel.forEach((file) => {
      formData.append("image_hotel", file);
    });

    const data = await addHotel(formData);

    if (data && !data.error) {
      alert("Hotel berhasil ditambahkan!");
      // Reset form
      setForm({
        nama_hotel: "",
        alamat_hotel: "",
        kota_hotel: "",
        email_hotel: "",
        notelp_hotel: "",
        image_hotel: [],
      });
      setPreviewUrls([]);
      navigasi("/hotel");
    } else {
      alert("Gagal menambahkan hotel.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mb-5">
      <button onClick={() => navigasi("/hotel")} className="flex cursor-pointer items-center gap-2 mb-6 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Tambah Hotel</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">Nama Hotel</label>
          <input
            type="text"
            name="nama_hotel"
            value={form.nama_hotel}
            onChange={handleChange}
            placeholder="Masukkan nama hotel"
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">Alamat Hotel</label>
          <textarea
            name="alamat_hotel"
            value={form.alamat_hotel}
            onChange={handleChange}
            placeholder="Masukkan alamat hotel"
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-600">Kota</label>
            <input
              type="text"
              name="kota_hotel"
              value={form.kota_hotel}
              onChange={handleChange}
              placeholder="Kota"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              name="email_hotel"
              value={form.email_hotel}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-600">No. Telepon</label>
            <input
              type="tel"
              name="notelp_hotel"
              value={form.notelp_hotel}
              onChange={handleChange}
              placeholder="No. Telepon"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">Foto Hotel</label>
          <label className="flex flex-col items-center justify-center bg-white w-full h-48 border-2 border-dashed border-blue-500 rounded-xl cursor-pointer hover:bg-blue-50 transition">
            <Upload className="w-10 h-10 text-blue-500 mb-2 " />
            <span className="text-gray-500 text-sm">Klik untuk memilih gambar</span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden " />
          </label>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-lg shadow group-hover:scale-105 transition-transform" />
                  <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 transition text-white font-bold rounded-lg disabled:opacity-50">
          {isLoading ? (
            "Menyimpan..."
          ) : (
            <>
              <PlusCircle className="w-5 h-5" /> Simpan Hotel
            </>
          )}
        </button>

        {isError && <div className="text-red-500 font-semibold text-sm mt-2">{isError}</div>}
      </form>
    </div>
  );
};

export default AddHotel;
