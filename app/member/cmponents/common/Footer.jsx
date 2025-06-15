"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
function Footer() {
  const r = useRouter();
  const rp = usePathname();

  const isActive = (path) => {
    if (rp.startsWith(`/member/${path}`) || (rp === "/member" && !path)) {
      return "font-bold scale-130 p-2";
    }

    return "border-transparent text-gray-800";
  };

  const handleClick = (path) => {
    r.push("/member/" + path);
  };

  return (
    <footer className="text-white fixed bottom-0 left-0 right-0 shadow-lg z-50">
      <div className="flex gap-1 justify-around items-center bg-gray-200/50 m-2 shadow-2xl rounded-full border-2  backdrop-blur-md">
        {/* กิจกรรม */}
        <div className="w-full text-center">
          <div
            onClick={() => handleClick("activity_member")}
            className={`flex justify-center  transition-all duration-300 cursor-pointer transform ${isActive(
              "activity_member"
            )}`}
          >
            <Image
              src={"/member_icons/activityy.png"}
              alt="กิจกรรม"
              width={50}
              height={50}
            />
          </div>
        </div>

        {/* ปุ่ม SCAN ตรงกลางแบบเด่น */}
        <div className="w-full text-center">
          <div
            onClick={() => handleClick("")}
            className={`flex justify-center transition-all duration-300 cursor-pointer transform ${isActive()}`}
          >
            <Image
              src={"/member_icons/home_scan.png"}
              alt="SCAN"
              width={50}
              height={50}
            />
          </div>
        </div>

        {/* โปรไฟล์ */}
        <div className="w-full text-center">
          <div
            onClick={() => handleClick("profile_member")}
            className={`flex justify-center transition-all duration-300 cursor-pointer transform ${isActive(
              "profile_member"
            )}`}
          >
            <Image
              src={"/member_icons/profile.png"}
              alt="กิจกรรม"
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
