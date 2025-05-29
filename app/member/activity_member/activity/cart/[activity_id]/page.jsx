"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { formatDateToThaiBE } from "@/utils/formatdatelocal";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
function page() {
  const p = useParams();
  const activity_id = p?.activity_id;

  const [subactivity, setSubActiivity] = useState(null);
  const [main, setMain] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  // method
  async function GetActivity(params) {
    try {
      const res = await axios.get(
        `/api/subActivity/getSubByActivity/${params}`
      );
      const res_main = await axios.get(`/api/activity/${params}`);
      setMain(res_main.data);
      setSubActiivity(res.data.data);
      // console.log(res.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    if (activity_id > 0) {
      GetActivity(activity_id);
    }
  }, [activity_id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* main */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0, x: -30 }}
        transition={{ duration: 0.4 }}
        className=" bg-gray-100 rounded-sm shadow-md"
      >
        {main ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="p-4 border-2 border-gray-800 rounded-sm shadow-md text-white bg-gray-800 space-y-2"
          >
            <div className="flex justify-between  gap-4">
              <div className="flex flex-col gap-1 ">
                <div>
                  <span className="font-semibold text-orange-400 w-40">
                    ชื่อกิจกรรม:
                  </span>{" "}
                  {main.activity_name}
                </div>
                <div>
                  <span className="font-semibold text-orange-400 w-40">
                    รายละเอียด:
                  </span>{" "}
                  {main.activity_description}
                </div>
                <div>
                  <span className="font-semibold text-orange-400 w-40">
                    จำนวนรับ:
                  </span>{" "}
                  {main.activity_max}
                </div>
                <div>
                  <span className="font-semibold text-orange-400 w-40">
                    วันที่เริ่ม:
                  </span>{" "}
                  {formatDateToThaiBE(main.activity_start)}
                </div>
              </div>
              <div className="">
                <button
                  onClick={() => addToCart(main)}
                  className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-xl"
                >
                  เข้าร่วม
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className=""></div>
        )}
      </motion.div>

      {/* subactivity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0, x: -30 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 mt-2 gap-2"
      >
        {subactivity && Array.isArray(subactivity) ? (
          subactivity.map((sub, index) => {
            if (
              sub.sub_activity_max > 0 &&
              cart.some((item) => item.activity_id === main.activity_id)
            ) {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  key={index}
                  className="p-3  rounded-lg shadow"
                >
                  <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold text-orange-400">
                        Subactivity Name:
                      </div>
                      <div>{sub.sub_activity_name}</div>
                      <div className="font-semibold text-orange-400 mt-2">
                        Details:
                      </div>
                      <div>{sub.sub_activity_description}</div>
                    </div>

                    <div className="">
                      <motion.button
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0, x: -30 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => addToCart(sub)}
                        className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-xl"
                      >
                        เข้าร่วม
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  key={index}
                  className="p-3 bg-gray-200  rounded-lg shadow pointer-events-none cursor-not-allowed"
                >
                  <div className="font-semibold text-gray-500">
                    Subactivity Name:
                  </div>
                  <div className="text-gray-500 ">{sub.sub_activity_name}</div>
                  <div className="font-semibold text-gray-500 mt-2">
                    Details:
                  </div>
                  <div className="text-gray-500 ">
                    {sub.sub_activity_description}
                  </div>
                </motion.div>
              );
            }
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="text-gray-300 flex justify-center items-center"
          >
            {!loading ? "ไม่มีข้อมูล" : "กำลังโหลด"}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default page;
