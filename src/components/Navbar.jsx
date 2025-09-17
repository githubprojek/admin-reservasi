import React from "react";

import Profile from "../features/auth/Profile";

const Navbar = () => {
  return (
    <header className="w-full px-6 py-4 bg-[#0F172A] border-b border-gray-800 shadow-sm flex items-center justify-between">
      <div></div>
      <div className=" text-white items-end justify-end">
        <Profile />
      </div>
    </header>
  );
};

export default Navbar;
