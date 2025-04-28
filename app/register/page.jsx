"use client";

// Import necessary dependencies
import React, { useState } from "react"; // Removed unused useEffect
import axios from "axios";

// Define the Register Page component
export default function RegisterPage() {
  const [registerData, setRegisterData] = useState({
    member_username: "",
    member_email: "",
    member_password: "",
    member_address: "",
  });
  const [error, setError] = useState(""); // Added error state for user feedback
  const [success, setSuccess] = useState(""); // Added success state for user feedback

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("api/user/profile", registerData);
      setSuccess("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      console.log("Response:", response.data);

      // Reset form after successful registration
      setRegisterData({
        member_username: "",
        member_email: "",
        member_password: "",
        member_address: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก"
      );
      console.error("Error:", error.response?.data || error.message);
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Register Card with Yellow Accent */}
      <div className="relative max-w-md w-full bg-white shadow-2xl rounded-xl p-8 space-y-8 border-t-4 border-yellow-400">
        {/* Decorative Yellow Circle */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="text-center mt-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            สมัครสมาชิก
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            กรอกข้อมูลเพื่อสมัครสมาชิก
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label
              htmlFor="member_username"
              className="block text-sm font-medium text-gray-800"
            >
              ชื่อผู้ใช้
            </label>
            <div className="mt-1 relative">
              <input
                id="member_username"
                type="text"
                name="member_username"
                placeholder="ชื่อผู้ใช้ของคุณ"
                value={registerData.member_username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="member_email"
              className="block text-sm font-medium text-gray-800"
            >
              อีเมล
            </label>
            <div className="mt-1 relative">
              <input
                id="member_email"
                type="email"
                name="member_email"
                placeholder="อีเมลของคุณ"
                value={registerData.member_email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="member_password"
              className="block text-sm font-medium text-gray-800"
            >
              รหัสผ่าน
            </label>
            <div className="mt-1 relative">
              <input
                id="member_password"
                type="password"
                name="member_password"
                placeholder="รหัสผ่านของคุณ"
                value={registerData.member_password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label
              htmlFor="member_address"
              className="block text-sm font-medium text-gray-800"
            >
              ที่อยู่
            </label>
            <div className="mt-1 relative">
              <textarea
                id="member_address"
                name="member_address"
                placeholder="ที่อยู่ของคุณ"
                value={registerData.member_address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
          >
            สมัครสมาชิก
          </button>
        </form>

        {/* Additional Links */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{" "}
            <a
              href="/"
              className="text-yellow-500 hover:text-yellow-600 font-medium transition duration-200"
            >
              เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
