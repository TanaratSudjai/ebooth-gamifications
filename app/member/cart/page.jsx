"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../../contexts/CartContext";
import { useRouter } from "next/navigation";
function page() {
  const r = useRouter();
  const { cart, removeFromCart } = useCart();
  const [activityId, setActivityId] = useState(null);

  const handleConfirmBooking = () => {
    // ดําเนินการยืนยันการจอง
    console.log("ยืนยันการจอง", activityId);
    r.push("/member/payments?activity_id=" + activityId);
  };

  useEffect(() => {
    setActivityId();
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="">
        <div className="p-4 text-center">
          รายการที่ต้องการจองว่างเปล่า
          <div className="flex w-full justify-center items-center">
            <button
              onClick={() => handleConfirmBooking()}
              className="bg-[#FF6F00] hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-200 mt-4"
            >
              ยืนยัน & ดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 mb-24"
    >
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 border-b pb-2 text-gray-800">
          รายการที่ต้องการจอง
        </h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ไม่มีรายการในตะกร้า</p>
        ) : (
          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            {cart.map((item, index) => (
              <li
                key={item.sub_activity_id || index + 1}
                className="border border-gray-300 rounded-md p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-shadow duration-150 hover:shadow-sm"
              >
                <div className="w-full sm:max-w-[70%]">
                  <div className="flex justify-between items-center">
                    {" "}
                    <p className="font-semibold text-lg sm:text-xl text-gray-900 ">
                      {item.sub_activity_name || item.activity_name}
                    </p>
                    <button
                      onClick={() =>
                         removeFromCart(item.sub_activity_id, item.activity_id)
                      }
                      className="bg-[#FF6F00] text-white px-2 rounded-md transition-colors duration-200"
                      aria-label={`ลบ ${item.sub_activity_name} ออกจากรายการ`}
                    >
                      ยกเลิก
                    </button>
                  </div>
                  <p className="text-gray-700  line-clamp-2">
                    รายละเอียด:{" "}
                    {item.sub_activity_description ||
                      item.activity_description ||
                      "ไม่มีรายละเอียด"}
                  </p>
                  <p className="text-sm text-gray-600">
                    ราคา:{" "}
                    <span className="font-medium text-amber-600">
                      {item.sub_activity_price || item.activity_price || 0} บาท
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    จำนวนเข้าร่วมจำกัด:{" "}
                    <span className="font-medium">
                      {item.sub_activity_max ||
                        item.activity_max ||
                        "ไม่จํากัด"}{" "}
                      คน
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
      <div className="flex w-full justify-center items-center">
        <button
          onClick={() => handleConfirmBooking()}
          className="bg-[#FF6F00] hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-200 mt-4"
        >
          ยืนยัน & ดำเนินการต่อ
        </button>
      </div>
    </motion.div>
  );
}

export default page;
