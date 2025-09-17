import React from "react";
import { useAuthStore } from "./useStoreAuth.js";

const Profile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null; // atau "Guest" kalau mau
  }

  return (
    <div className="text-right">
      <p className="text-sm font-semibold">{user.fullName}</p>
      <p className="text-xs text-gray-400">{user.role}</p>
    </div>
  );
};

export default Profile;
