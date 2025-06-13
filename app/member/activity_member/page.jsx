"use client";
import React, { useState } from "react";
import { useUserData } from "@/contexts/MemberContext";
import { formatDateToThaiBE } from "@/utils/formatdatelocal";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
function Page() {
  const r = useRouter();
  const { activity, loading } = useUserData();
  console.log(activity);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredActivities = activity?.filter((act) =>
    act.activity_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActivity = (params) => {
    r.push("activity_member/activity/cart/" + params);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          {/* <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="ค้นหากิจกรรมที่ต้องการเข้าร่วม"
            className="w-full p-3 bg-white rounded-3xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
          /> */}

          <div className="flex justify-center">
            <span
              style={{
                WebkitTextStroke: "1.2px #c67a4b",
                textShadow: "2px 2px 0 red",
              }}
              className="sticky w-full top-0 z-50 text-2xl font-extrabold text-yellow-400 bg-[#ffcb53] px-6 py-3 rounded-3xl shadow-lg inline-block text-center  tracking-wide"
            >
              กิจกรรมทั้งหมด
            </span>
          </div>
        </div>
        {loading ? (
          <div className="flex mt-5 w-full justify-center items-center h-48 text-gray-500 animate-pulse">
            ⏳ กำลังโหลดข้อมูลกิจกรรมทั้งหมด...
          </div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-20 px-8">
            {filteredActivities.map(
              (act, index) =>
                act.activity_max > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={index}
                    onClick={() => {
                      handleActivity(act.activity_id);
                    }}
                    className={`hover:shadow-xl transition duration-300 rounded-4xl shadow-2xl p-4 border-6 border-orange-400 h-[300px] relative overflow-hidden`}
                    style={{
                      backgroundImage: `url(${act.activity_image})`,
                      backgroundSize: "cover", 
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      WebkitTextStroke: "1px #c67a4b",
                      textShadow: "2px 2px 0 red",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30 z-0 rounded-4xl" />
                    <span className="relative z-10 text-yellow-400 font-bold text-lg flex justify-center bg-[#fce04e] py-2 px-4 rounded-2xl border-4 border-orange-400 mt-2">
                      {act.activity_name}
                    </span>
                  </motion.div>
                )
            )}
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-400 text-lg">
            😢 ไม่พบกิจกรรมที่ค้นหา
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Page;
