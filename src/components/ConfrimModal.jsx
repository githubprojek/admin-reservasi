import React, { useEffect, useState } from "react";

const ConfirmModal = ({ open, title, description, onCancel, onConfirm }) => {
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      // Delay untuk animasi keluar
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200 ${open ? "bg-black/40" : "bg-black/0"}`}>
      <div className={`bg-white rounded-xl p-6 w-full max-w-md shadow-lg transform transition-all duration-200 ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{description}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
