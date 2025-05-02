"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
function DataActivity({ isMobile }) {
  const [activity, setActivity] = useState([]); // [activity]
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/activity");
      setActivity(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleParams = (activity_id) => {
    console.log(activity_id);
  };

  const filteredActivity = activity.filter((item) =>
    item.activity_name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-5">
      <div className="flex flex-col md:flex-row gap-2 px-4 justify-center items-center md:justify-between">
        <h1>รายการกิจกรรมทั้งหมด</h1>
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
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {!isMobile ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-2 text-sm"
            >
              {filteredActivity.map((item) => (
                <div
                  onClick={() => handleParams(item.activity_id)}
                  key={item.activity_id}
                  className="bg-black p-2 rounded-lg border-r-2 border-r-blue-500"
                >
                  <p>{item.activity_name}</p>
                  <p className="text-xs text-gray-300">
                    {dayjs(item.activity_date).format("DD/MM/YYYY")} ถึง{" "}
                    {dayjs(item.activity_end).format("DD/MM/YYYY")}
                  </p>
                </div>
              ))}
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
                  <tr className="text-blue-500 bg-white">
                    <th className="text-left">ชื่อกิจกรรม</th>
                    <th>วันที่</th>
                    <th>จำนวนผู้เข้าร่วม</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredActivity.map((item) => (
                    <tr
                      key={item.activity_id}
                      onClick={() => handleParams(item.activity_id)}
                      className="cursor-pointer  hover:bg-gray-400 hover:text-black transform transition hover:scale-101 duration-300 ease-in-out"
                    >
                      <td className="text-left">{item.activity_name}</td>
                      <td>
                        {" "}
                        {dayjs(item.activity_date).format("DD/MM/YYYY")} -{" "}
                        {dayjs(item.activity_end).format("DD/MM/YYYY")}
                      </td>
                      <td>
                        ว่าง{" "}
                        <span className="text-blue-500">
                          {item.activity_max}{" "}
                        </span>{" "}
                        ที่นั่ง
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

export default DataActivity;
