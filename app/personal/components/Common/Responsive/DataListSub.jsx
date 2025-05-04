"use client";
import React, { useEffect, useState } from "react";
import ButtonBack from "../BottonBack";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { useAlert } from "@/contexts/AlertContext";
import { array } from "zod";
function DataListSub({ isMobile, member_id, activity_id }) {
  const [searchText, setSearchText] = useState("");
  const [subActivity, setSubActivity] = useState([]);
  const [nameMain, setNameMain] = useState(null);
  const { showSuccess, showError, showWarning } = useAlert();
  //   mathod
  const fetchData = async () => {
    if (member_id === null) return;
    try {
      const res = await axios.get(
        `/api/getCheckinDetail/${member_id}/getSubAcvitity/${activity_id}`
      );
      setSubActivity(res.data.data.activity.subactivity);
      console.log(res.data.data.activity.subactivity);
      setNameMain(res.data.data.activity.activity_name);
      //   console.log(res.data.data.activity.activity_id);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredSubActivity = subActivity.filter((item) =>
    item.sub_activity_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckIn = async (sub_id) => {
    console.log(
      "สมาชิก รหัส",
      Number(member_id),
      "เข้าร่วมบูท รหัสที่ " +
        Number(sub_id) +
        "ในกิจกรรมที่ " +
        Number(activity_id) +
        " สำเร็จ"
    );
    try {
      if (member_id === null || activity_id === null) return;
      const response = await axios.put(
        `/api/checkin/updateCheckin/onSubActivity`,
        {
          member_id: Number(member_id),
          activity_id: Number(activity_id),
          sub_activity_ids: [Number(sub_id)],
        }
      );
      if (response.status === 200) {
        showSuccess("เช็คชื่อสำเร็จ", "เชิญเข้าร่วมงานได้เลยครับ!");
      } else {
        showError("เช็คชื่อผิดพลาด", "กรุณารอสักครู่!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (member_id !== null && activity_id !== null) {
      fetchData();
    }
  }, [member_id, activity_id]);

  return (
    <div>
      <ButtonBack />
      <div className="mt-5">
        <div className="flex flex-col md:flex-row gap-2 px-4 justify-center items-center md:justify-between">
          <h1>รายการบูทภายในกิจกรรม {nameMain}</h1>
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="รายการบูท"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>

        <div className="mt-5 mb-5">
          <AnimatePresence mode="wait">
            {!isMobile ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm"
              >
                <div className="grid md:grid-cols-3 gap-2 overflow-y-auto ">
                  {filteredSubActivity.map((sub) => (
                    <div
                      key={sub.sub_activity_id}
                      className="bg-base-300 p-2 rounded-xl border-r-2 border-r-blue-300"
                    >
                      <div className="p-1 flex flex-col gap-2">
                        <div className="bg-base-100 rounded-md px-2 py-1 flex gap-2">
                          <span className="bg-base-300 text-blue-300 px-3 rounded-2xl">
                            บูท{" "}
                          </span>
                          {sub.sub_activity_name}
                        </div>
                        <p className="text-gray-400 text-left">
                          <span className="text-blue-300">ตำแหน่ง</span>:{" "}
                          {sub?.sub_activity_description ? (
                            sub.sub_activity_description
                          ) : (
                            <span className="text-gray-500">กำลังโหลด...</span>
                          )}
                        </p>

                        <div className="">
                          คะแนนในการเข้าร่วมบูท
                          <span className="bg-base-300 px-2 rounded-2xl">
                            {sub.sub_activity_point} คะแนน
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckIn(sub.sub_activity_id);
                          }}
                          className="btn mt-2 bg-blue-400 w-auto rounded-2xl text-base-200"
                        >
                          เช็คชื่อ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className=" border-gray-500  p-2 overflow-y-auto"
              >
                {/* table make */}
                <table className="table w-full">
                  <thead className="text-center">
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อบูท</th>
                      <th>รายละเอียด</th>
                      <th>คะแนนการเข้าร่วมบูท</th>
                      <th>หมดเขตกิจกรรม</th>
                      <th>เช็คอินเข้าร่วมงาน</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredSubActivity.map((sub, index) => (
                      <tr key={sub.sub_activity_id}>
                        <td>{index + 1}</td>
                        <td>{sub.sub_activity_name}</td>
                        <td>{sub.sub_activity_description}</td>
                        <td>{sub.sub_activity_point} คะแนน</td>
                        <td>
                          {dayjs(sub.sub_activity_end).format("DD/MM/YYYY")}
                        </td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckIn(
                                Number(member_id),
                                sub.sub_activity_id,
                                sub.sub_activity_id
                              );
                            }}
                            className="btn mt-2 bg-blue-400 w-auto rounded-2xl text-base-200"
                          >
                            เช็คชื่อ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DataListSub;
