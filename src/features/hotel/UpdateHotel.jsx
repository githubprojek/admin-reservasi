import { useState, useEffect } from "react";
import { useStoreHotel } from "./useStoreHotel.js";
import { Upload, Save, X, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateHotel = () => {
  const { updateHotel } = useStoreHotel();
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state;

  const [form, setForm] = useState({
    nama_hotel: "",
    alamat_hotel: "",
    kota_hotel: "",
    email_hotel: "",
    notelp_hotel: "",
    image_hotel: [], // file baru
  });

  const [previewUrls, setPreviewUrls] = useState([]); // preview file baru
  const [existingImages, setExistingImages] = useState([]); // image lama
  const [removeImages, setRemoveImages] = useState([]); // image lama yang mau dihapus

  useEffect(() => {
    if (hotel) {
      setForm({
        nama_hotel: hotel.nama_hotel || "",
        alamat_hotel: hotel.alamat_hotel || "",
        kota_hotel: hotel.kota_hotel || "",
        email_hotel: hotel.email_hotel || "",
        notelp_hotel: hotel.notelp_hotel || "",
        image_hotel: [],
      });

      setExistingImages(hotel.image_hotel || []);
    }
  }, [hotel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      image_hotel: [...prev.image_hotel, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      image_hotel: prev.image_hotel.filter((_, i) => i !== idx),
    }));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setRemoveImages((prev) => [...prev, url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_hotel", form.nama_hotel);
    formData.append("alamat_hotel", form.alamat_hotel);
    formData.append("kota_hotel", form.kota_hotel);
    formData.append("email_hotel", form.email_hotel);
    formData.append("notelp_hotel", form.notelp_hotel);

    // Kirim file baru
    form.image_hotel.forEach((file) => {
      formData.append("image_hotel", file); // ❗️ backend expects "images" (lihat route update)
    });

    // Kirim daftar gambar lama yang mau dihapus
    removeImages.forEach((url) => {
      formData.append("remove_images", url);
    });

    try {
      await updateHotel(hotel._id, formData);
      alert("Hotel berhasil diperbarui!");
      navigate("/hotel");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui hotel.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Edit Hotel</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">Nama Hotel</label>
          <input
            type="text"
            name="nama_hotel"
            value={form.nama_hotel}
            onChange={handleChange}
            placeholder="Nama hotel"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">Alamat Hotel</label>
          <textarea
            name="alamat_hotel"
            value={form.alamat_hotel}
            onChange={handleChange}
            placeholder="Alamat hotel"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">Foto Hotel</label>

          {/* Foto lama */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Existing ${idx}`} className="w-full h-32 object-cover rounded-lg shadow group-hover:scale-105 transition-transform" />
                  <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload baru */}
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-500 rounded-xl cursor-pointer hover:bg-blue-50 transition">
            <Upload className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-gray-500 text-sm">Klik untuk memilih gambar baru</span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`New Preview ${idx}`} className="w-full h-32 object-cover rounded-lg shadow group-hover:scale-105 transition-transform" />
                  <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 transition text-white font-bold rounded-lg">
          <Save className="w-5 h-5" /> Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default UpdateHotel;
