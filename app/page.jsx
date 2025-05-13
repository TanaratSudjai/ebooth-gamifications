"use client";

// Import necessary dependencies
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define the Login Page component
export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    member_email: "",
    member_password: "",
  });
  const [error, setError] = useState("");

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email: loginData.member_email,
      password: loginData.member_password,
      redirect: false,
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else if (result?.ok) {
      router.push("/redirect");
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Login Card with Yellow Accent */}
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
              d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m0 0H8m4 0v4m-6-8h12"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="text-center mt-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            เข้าสู่ระบบ
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={loginData.member_email}
                onChange={handleInputChange}
                className="input w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300"
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
                value={loginData.member_password}
                onChange={handleInputChange}
                className="input w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Additional Links */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <a
              href="/register"
              className="text-yellow-500 hover:text-yellow-600 font-medium transition duration-200"
            >
              สมัครสมาชิก
            </a>
          </p>
          <p className="text-sm text-gray-600">
            ลืมรหัสผ่าน?{" "}
            <a
              href="/forgot-password"
              className="text-yellow-500 hover:text-yellow-600 font-medium transition duration-200"
            >
              กู้คืนรหัสผ่าน
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
