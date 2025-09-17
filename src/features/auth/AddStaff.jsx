import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./useStoreAuth"; // path disesuaikan

const AddStaff = () => {
  const navigate = useNavigate();
  const { addStaff } = useAuthStore();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    notelp: "",
    password: "",
    role: "Admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addStaff(form);
      navigate("/staff");
    } catch (err) {
      console.error(err);
      setError(err || "Gagal menambahkan staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8 mb-5">
      {/* Tombol kembali di kiri atas */}
      <button onClick={() => navigate("/staff")} className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800">
        <ChevronLeft size={20} /> Kembali
      </button>

      {/* Form di tengah */}
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Staff Baru</h1>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Nomor Telepon</label>
            <input type="number" name="notelp" value={form.notelp} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" />
          </div>

          <button type="submit" disabled={loading} className={`w-full bg-blue-600 text-white py-2 rounded transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}>
            {loading ? "Menyimpan..." : "Tambah Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
