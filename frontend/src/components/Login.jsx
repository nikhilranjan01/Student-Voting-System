import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import api from "../api/axios";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [health, setHealth] = useState("");

  const navigate = useNavigate();

  // 🔹 Backend health check
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.text())
      .then((data) => setHealth(data))
      .catch((err) => console.error("Backend Error:", err));
  }, []);

  // 🔹 Login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);
      setToken(token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/background.jpeg')" }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/30">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/jiet-logo.png"
            alt="Logo"
            className="h-16 w-16 rounded-full shadow-md"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Welcome Back 👋
          <br />
          <span className="text-sm text-gray-700">{health}</span>
        </h2>

        {error && (
          <p className="text-red-600 text-center bg-red-100 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="name@jietjodhpur.ac.in"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-800 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-700">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
