"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function DataListMember({ isMobile, activity_id }) {
  const r = useRouter();
  const ac_id = activity_id;
  const [searchText, setSearchText] = useState("");
  const [member, setMember] = useState([]);

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
  const handleParams = (member_id) => {
    console.log(member_id);
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
                {filteredmember.map((member) => (
                  <div
                    key={member.member_id}
                    onClick={() => handleParams(member.member_id)}
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
                      <div className="">
                        ที่อยุ่{" "}
                        <span className="bg-base-300 px-2 rounded-2xl">
                          {member.member_address}
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
                  <tr className="text-blue-400 bg-white">
                    <th className="text-left">ลำดับ</th>
                    <th className="text-left">รายชื่อ</th>
                    <th>ที่อยู่</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredmember.map((member, index) => (
                    <tr
                      key={member.member_id}
                      onClick={() => handleParams(member.member_id)}
                      className="cursor-pointer  hover:bg-gray-400 hover:text-black transform transition hover:scale-101 duration-300 ease-in-out"
                    >
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{member.member_username}</td>
                      <td>{member.member_address}</td>
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

// http://127.0.0.1:3000/api/getCheckinDetail/17/getSubAcvitity/26  กดไปดูกิจกรรมย่อยจาก id member
export default DataListMember;
