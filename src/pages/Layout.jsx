import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Breadcrump from "../components/Breadcrump";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen pl-56 bg-gray-100">
        <Navbar />
        <div className="px-6 py-4">
          <Breadcrump />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
