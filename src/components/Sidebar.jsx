import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, LogOut, ArchiveIcon, HotelIcon, BedDoubleIcon, BookCheck, Building2Icon, UserCog2Icon } from "lucide-react";
import { useAuthStore } from "../features/auth/useStoreAuth";

const Sidebar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      section: "Main",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
        { to: "/staff", label: "Staff", icon: UserCog2Icon },
      ],
    },
    {
      section: "Master",
      items: [
        { to: "/hotel", label: "Hotel", icon: HotelIcon },
        { to: "/room", label: "Room", icon: BedDoubleIcon },
        { to: "/fasilitas", label: "Fasilitas", icon: Building2Icon },
      ],
    },
    {
      section: "Transaksi",
      items: [
        { to: "/reservasi", label: "Reservasi", icon: BookCheck },
        { to: "/historyReservasi", label: "History", icon: ArchiveIcon },
      ],
    },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#0F172A] border-r border-gray-800 shadow-sm flex flex-col">
      {/* HEADER */}
      <div className="py-6 text-center border-b border-gray-700">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Dashboard</h1>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-0 py-6 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{section.section}</p>
            <div className="space-y-1">
              {section.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `flex w-full items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${isActive ? "bg-blue-600 text-white shadow" : "text-gray-300 hover:bg-blue-500 hover:text-white"}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* LOGOUT - Pinned to bottom */}
      <div className="px-4 py-4 border-t border-gray-700 mt-auto">
        <div onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors">
          <LogOut size={20} className="opacity-80" />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
