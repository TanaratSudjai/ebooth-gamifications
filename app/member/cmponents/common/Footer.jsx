"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

function Footer() {
  const r = useRouter();
  const rp = usePathname();

  const isActive = (path) => {
    if (rp.startsWith(`/member/${path}`)) {
      return "border-[#FF6F00] text-[#FF6F00] font-bold scale-110 shadow-md";
    }
    return "border-transparent text-gray-800";
  };

  const handleClick = (path) => {
    r.push("/member/" + path);
  };

  return (
    <footer className="text-white fixed bottom-0 left-0 right-0 shadow-lg z-50">
      <div className="flex gap-2 justify-around items-center bg-white p-2">
        {/* กิจกรรม */}
        <div className="w-full text-center">
          <div
            onClick={() => handleClick("activity_member")}
            className={`border-2 shadow-2xl rounded-full bg-white px-4 py-2 hover:bg-orange-100 transition-all duration-300 cursor-pointer transform ${isActive(
              "activity_member"
            )}`}
          >
            <span>กิจกรรม</span>
          </div>
        </div>

        {/* ปุ่ม SCAN ตรงกลางแบบเด่น */}
        <div className="w-full text-center">
          <div
            onClick={() => handleClick("")}
            className="bg-[#FF6F00] text-white px-6 py-3 rounded-full shadow-xl border-4 border-white cursor-pointer hover:scale-110 transform transition-transform duration-300"
          >
            <span className="font-bold text-lg">SCAN</span>
          </div>
        </div>

        {/* โปรไฟล์ */}
        <div className="w-full text-center">
          <div
            onClick={() => handleClick("profile_member")}
            className={`border-2 shadow-2xl rounded-full bg-white px-4 py-2 hover:bg-orange-100 transition-all duration-300 cursor-pointer transform ${isActive(
              "profile_member"
            )}`}
          >
            <span>โปรไฟล์</span>
          </div>
        </div>
      </div>
      <div className="text-center text-xs py-2 border-t border-gray-700 bg-gray-900">
        &copy; 2025 Webb Application eBooth. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
