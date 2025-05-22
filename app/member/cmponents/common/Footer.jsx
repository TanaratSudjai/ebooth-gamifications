"use client";
import React from "react";
import { useRouter } from "next/navigation";
function Footer() {
  const r = useRouter();

  const handleClick = (path) => {
    r.push("/member/" + path);
  };
  return (
    <footer className="bg-gray-800 text-white">
      <div className="flex justify-around gap-2 p-2">
        <div
          onClick={() => {
            handleClick("activity_member");
          }}
          className="py-1 px-3 bg-white shadow rounded-md cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out text-gray-800"
        >
          <span>กิจกรรม</span>
        </div>
        <div
          onClick={() => {
            handleClick("profile_member");
          }}
          className="py-1 px-3 bg-white shadow rounded-md cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out text-gray-800"
        >
          <span>โปรไฟล์</span>
        </div>
        <div
          onClick={() => {
            handleClick("");
          }}
          className="py-1 px-3 bg-white shadow rounded-md cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out text-gray-800"
        >
          <span>SCAN</span>
        </div>
        <div
          onClick={() => {
            handleClick("history_member");
          }}
          className="py-1 px-3 bg-white shadow rounded-md cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out text-gray-800"
        >
          <span>ประวัติการเข้าร่วม</span>
        </div>
      </div>
      <div className="text-center text-xs py-2 border-t border-gray-600">
        &copy; 2025 Webb Application eBooth All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
