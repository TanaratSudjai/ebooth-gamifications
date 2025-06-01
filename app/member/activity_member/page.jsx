"use client";
import React, { useState } from "react";
import { useUserData } from "@/contexts/MemberContext";
import { formatDateToThaiBE } from "@/utils/formatdatelocal";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
function Page() {
  const r = useRouter();

  const { addToCart } = useCart();

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
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="ค้นหากิจกรรมที่ต้องการเข้าร่วม"
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
          />
          <span className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">
            จำนวนกิจกรรมทั้งหมด:{" "}
            <span className="text-amber-500 font-bold">
              {activity?.length || 0}
            </span>{" "}
            รายการ
          </span>
        </div>

        {loading ? (
          <div className="flex w-full justify-center items-center h-48 text-gray-500 animate-pulse">
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
                    className={`hover:shadow-xl transition duration-300 rounded-4xl shadow-2xl p-4 border-6 border-orange-400 h-[300px]`}
                    style={{ backgroundImage: `url(${act.activity_image})` }}
                  >
                    <span className="text-stroke text-white font-bold text-lg relative z-0 top-[-35px] flex justify-center bg-amber-300 py-2 px-4 rounded-2xl border-4 border-orange-400 ">
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
