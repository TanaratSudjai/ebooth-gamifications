"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

function Footer() {
  const r = useRouter();
  const rp = usePathname();

  const isActive = (path) => {
    if (rp.startsWith(`/member/${path}`)) {
      return "border-[#FF6F00] text-[#FF6F00] font-semibold";
    }
    return "border-transparent";
  };

  const handleClick = (path) => {
    r.push("/member/" + path);
  };

  return (
    <footer className="bg-gray-900 text-white fixed bottom-0 left-0 right-0 shadow-lg z-50">
      <div className="flex justify-around items-center px-4 py-3 relative">
        {/* กิจกรรม */}
        <div
          onClick={() => handleClick("activity_member")}
          className={`py-2 px-4 border-2 rounded-xl bg-white text-gray-800 hover:bg-orange-100 transition-all duration-300 cursor-pointer ${isActive("activity_member")}`}
        >
          <span>กิจกรรม</span>
        </div>

        {/* ปุ่ม SCAN ตรงกลางแบบเด่น */}
        <div
          onClick={() => handleClick("")}
          className="absolute -top-15 left-1/2 transform -translate-x-1/2 bg-[#FF6F00] text-white px-6 py-3 rounded-full shadow-xl border-4 border-white cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <span className="font-bold">SCAN</span>
        </div>

        {/* ประวัติการเข้าร่วม */}
        <div
          onClick={() => handleClick("history_member")}
          className={`py-2 px-4 border-2 rounded-xl bg-white text-gray-800 hover:bg-orange-100 transition-all duration-300 cursor-pointer ${isActive("history_member")}`}
        >
          <span>ประวัติ</span>
        </div>

        {/* โปรไฟล์ */}
        <div
          onClick={() => handleClick("profile_member")}
          className={`py-2 px-4 border-2 rounded-xl bg-white text-gray-800 hover:bg-orange-100 transition-all duration-300 cursor-pointer ${isActive("profile_member")}`}
        >
          <span>โปรไฟล์</span>
        </div>
      </div>

      <div className="text-center text-xs py-2 border-t border-gray-700 bg-gray-900">
        &copy; 2025 Webb Application eBooth. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
