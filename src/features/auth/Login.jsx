import React, { useState, useEffect } from "react";
import { useAuthStore } from "./useStoreAuth.js";
import { useNavigate, Link } from "react-router-dom";
import gambarHotel from "../../assets/gambar-hotel.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-4">Sign In</h1>
          <p className="text-gray-500 mb-8">Welcome back! Please login to your account.</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-600" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-600" placeholder="••••••••" />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              {isLoading ? "Processing..." : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">&copy; {new Date().getFullYear()} Le Maridien Jakarta</p>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:block md:w-1/2">
        <img src={gambarHotel} alt="Illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
