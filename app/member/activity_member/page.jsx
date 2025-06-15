"use client";
import React, { useState } from "react";
import { useUserData } from "@/contexts/MemberContext";
import { formatDateToThaiBE } from "@/utils/formatdatelocal";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
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
      className="container mx-auto "
    >
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-center">
            <div className="w-full bg-gray-200/60 shadow-2xl rounded-full p-2 flex items-center gap-2 border-2 border-white backdrop-blur-md ">
              <div className="w-full text-center font-bold text-gray-700">
                กิจกรรมทั้งหมด
              </div>
            </div>
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
                    className={`hover:shadow-xl bg-gray-200/20 transition duration-300 rounded-2xl border-3 border-white shadow-2xl relative overflow-hidden`}
                  >
                    <div className="flex justify-between">
                      <div className=" bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-gray-700 flex flex-col gap-1">
                        <span>{act.activity_name}</span>
                        <span>
                          {act.activity_price > 0
                            ? `${act.activity_price} บาท`
                            : "ไม่มีค่าใช้จ่าย"}
                        </span>
                      </div>
                      <div className=" bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                        {formatDateToThaiBE(act.activity_start)}
                      </div>
                    </div>
                    <Image
                      src={act.activity_image}
                      alt={act.activity_name}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover rounded-xl"
                    />
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
