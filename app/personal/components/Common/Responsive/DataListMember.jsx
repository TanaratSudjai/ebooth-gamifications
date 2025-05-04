"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAlert } from "@/contexts/AlertContext";
function DataListMember({ isMobile, activity_id }) {
  const r = useRouter();
  const ac_id = activity_id;
  const [searchText, setSearchText] = useState("");
  const [member, setMember] = useState([]);
  const { showSuccess, showError, showWarning } = useAlert();

  const fetchData = async (id) => {
    try {
      const res = await axios.get(`/api/personnel/getMemberByActivityId/${id}`);
      setMember(res.data.data.members);
      // console.log(res.data.data.members);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredmember = member.filter((item) =>
    item.member_username.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleParams = (member_id, activity_id, sub_id = 0) => {
    console.log(member_id, activity_id);
    r.push(
      `/personal/booking/${activity_id}/sub/${sub_id}/member/${member_id}`
    );
  };

  const handleCheckIn = async (member_id, activity_id) => {
    console.log(
      "สมาชิก รหัส",
      member_id,
      "เข้าร่วมกิจกรรม รหัสที่ " + Number(activity_id) + " สำเร็จ"
    );
    try {
      const response = await axios.put(
        `/api/checkin/updateCheckin/onActivity`,
        { member_id: member_id, activity_id: activity_id }
      );
      if (response.status === 200) {
        showSuccess("เช็คชื่อสำเร็จ", "เชิญเข้าร่วมงานได้เลยครับ!");
      } else {
        showError("เช็คชื่อผิดพลาด", "กรุณารอสักครู่!");
      }
    } catch (err) {
      showError(
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถเช็คชื่อได้"
      );
    }
  };

  useEffect(() => {
    if (ac_id !== null) {
      fetchData(ac_id);
    }
  }, [ac_id]);
  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-2 px-4 justify-center items-center md:justify-between">
        <h1>ผู้เข้าร่วมกิจกรรมทั้งหมด</h1>
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
            placeholder="ค้นหารายชื่อ"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </div>
      {/* is moblie  */}
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
              <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto">
                {filteredmember.map((member) => (
                  <div
                    key={member.member_id}
                    onClick={() =>
                      handleParams(Number(member.member_id), Number(ac_id))
                    }
                    className="bg-base-300 p-2 rounded-xl border-r-2 border-r-blue-300"
                  >
                    <div className="text-blue-400 bg-base-100 p-1 px-2 rounded-xl w-auto">
                      {member.is_admin ? "ผู้ดูแล" : "ผู้เข้าร่วมกิจกรรม"}
                    </div>
                    <div className="p-1 flex flex-col gap-2">
                      <div className="">
                        ชื่อ{" "}
                        <span className="bg-base-300 px-2 rounded-2xl">
                          {member.member_username}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="bg-base-300 rounded-2xl flex gap-2">
                          <p className="text-blue-300">ที่อยุ่</p>{" "}
                          {member.member_address}
                        </span>
                        <span className="bg-base-300 px-2 rounded-2xl">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckIn(member.member_id, Number(ac_id));
                            }}
                            className="btn bg-blue-400 w-auto rounded-2xl text-base-200"
                          >
                            เช็คชื่อ
                          </button>
                        </span>
                      </div>
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
              <table className="table">
                <thead className="text-center">
                  <tr className="text-blue-400  bg-base-300">
                    <th className="text-left">ลำดับ</th>
                    <th className="text-left">รายชื่อ</th>
                    <th>ที่อยู่</th>
                    <th>เช็คอินเข้าร่วมงาน</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredmember.map((member, index) => (
                    <tr
                      key={member.member_id}
                      onClick={() => handleParams(member.member_id, ac_id)}
                      className="cursor-pointer  hover:bg-gray-400 hover:text-black transform transition hover:scale-101 duration-300 ease-in-out"
                    >
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{member.member_username}</td>
                      <td>{member.member_address}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckIn(
                              member.member_id,
                              Number(ac_id),
                              Number()
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
  );
}

export default DataListMember;
