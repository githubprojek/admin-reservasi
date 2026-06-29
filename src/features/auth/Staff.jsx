import { useEffect, useState } from "react";
import { useAuthStore } from "./useStoreAuth.js"; // path sesuaikan
import { User, Phone, Mail, Edit, Trash2, Plus } from "lucide-react";
import ConfirmModal from "../../components/ConfrimModal.jsx";
import { useNavigate } from "react-router-dom";

const Staff = () => {
  const { staffList, getStaff, deleteStaff, user } = useAuthStore();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStaff();
  }, [getStaff]);

  const handleUpdateStaff = (staff) => {
    navigate("/staff/update-staff", { state: staff });
  };

  const handleAddStaff = () => {
    navigate("/staff/add-staff");
  };

  const handleConfirmDelete = async () => {
    if (selectedStaff) {
      await deleteStaff(selectedStaff._id);
      setSelectedStaff(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Manajemen Staff</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* === CARD TAMBAH STAFF === */}

          {/* === CARD TAMBAH STAFF === */}
          {user?.role === "Super Admin" && (
            <div onClick={handleAddStaff} className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-blue-400 rounded-lg p-6 hover:bg-blue-50 transition">
              <Plus size={36} className="text-blue-500 mb-2" />
              <span className="text-blue-600 font-medium">Tambah Staff</span>
            </div>
          )}

          {/* === CARD STAFF === */}
          {staffList.length === 0 && <div className="text-gray-500">No staff found.</div>}

          {staffList.map((staff) => (
            <div key={staff._id} className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between transition hover:shadow-xl">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-[#0F172A] mb-1 flex items-center gap-2">
                  <User size={18} /> {staff.fullName}
                </h2>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Mail size={16} /> {staff.email}
                </p>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Phone size={16} /> {staff.notelp}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{staff.role}</span>
              </div>

              {user?.role === "Super Admin" && (
                <div className="flex justify-end gap-4">
                  <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline" onClick={() => handleUpdateStaff(staff)}>
                    <Edit size={16} /> Edit
                  </button>

                  <button className="inline-flex items-center gap-1 text-sm text-red-500 hover:underline" onClick={() => setSelectedStaff(staff)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal open={!!selectedStaff} title="Hapus Staff" description={`Yakin ingin menghapus Staff "${selectedStaff?.fullName}"?`} onCancel={() => setSelectedStaff(null)} onConfirm={handleConfirmDelete} />
    </section>
  );
};

export default Staff;
