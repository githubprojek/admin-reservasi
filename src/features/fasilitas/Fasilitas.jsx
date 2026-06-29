import { useEffect, useState } from "react";
import { useStoreFasilitas } from "./useStoreFasilitas";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../../components/ConfrimModal";
import { useAuthStore } from "../auth/useStoreAuth.js";

const Fasilitas = () => {
  const { user } = useAuthStore();
  const { fasilitasList, fetchFasilitas, addFasilitas, deletefasilitas } = useStoreFasilitas();
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchFasilitas();
  }, [fetchFasilitas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addFasilitas({ name });
    setName("");
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await deletefasilitas(selectedId);
      fetchFasilitas();
      setSelectedId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pl-6 pr-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Fasilitas</h1>
      {user?.role === "Super Admin" && (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-10">
          <input type="text" placeholder="Nama fasilitas" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white " />
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Tambah Fasilitas
          </button>
        </form>
      )}

      {fasilitasList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fasilitasList.map((item) => (
            <div key={item._id} className="bg-white flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-gray-800">{item.name}</div>
              {user?.role === "Super Admin" && (
                <button onClick={() => setSelectedId(item._id)} className="text-red-500 hover:text-red-600 transition" title="Hapus">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">Belum ada fasilitas.</div>
      )}

      <ConfirmModal open={!!selectedId} title="Hapus Fasilitas" description="Yakin ingin menghapus fasilitas ini?" onCancel={() => setSelectedId(null)} onConfirm={handleConfirmDelete} />
    </div>
  );
};

export default Fasilitas;
