"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
function Organize({ id = "" }) {
  const [organize, setOrganize] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (id !== 0) {
        setLoading(false);
        const response = await axios.get(`/api/organize/organizeDetail/${id}`);
        setOrganize(response.data);
        setActivity(response.data.organize.activity);

        // console.log("organize   ", response.data);
        // console.log("activity    ", response.data.organize.activity);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id || id !== 0) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
      <div className="w-full mx-auto p-5">
        {!loading && organize?.organize && (
          <div className="container mx-auto flex flex-col md:flex-row gap-2 ">
            <div className="w-full h-auto p-3 rounded-lg  ">
              <div className="flex flex-col gap-2 items-center justify-center ">
                <>
                  <div className="flex w-full flex-col md:flex-row items-center justify-start gap-2">
                    <div className="text-2xl w-[100%] font-bold border px-5 rounded-md flex justify-start border-gray-300">
                      {organize.organize.organize_name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full justify-start rounded-lg p-2 border border-gray-300">
                    <div className="text-gray-600 flex gap-2">
                      <span className="font-bold">ที่อยู่</span>
                      {organize.organize.organize_address}
                    </div>
                    <div className="text-gray-600 flex gap-2">
                      <span className="font-bold">รายละเอียด</span>
                      {organize.organize.organize_description}
                    </div>
                    <div className="text-gray-600 flex gap-2">
                      <span className="font-bold">ติดต่อ </span>
                      {organize.organize.organize_tel}
                    </div>
                  </div>
                </>
              </div>
            </div>
            <div className="w-full flex flex-col border border-gray-300  p-3 gap-2 overflow-y-auto max-h-[800px]  rounded-xl">
              {Array.isArray(activity) && activity.length > 0 ? (
                activity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 p-4 border border-amber-400 rounded-xl  bg-white"
                  >
                    {/* ชื่อกิจกรรม + ราคา + ที่ว่าง */}
                    <div className="bg-amber-300 p-3 rounded-lg flex flex-col gap-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {activity.activity_name}
                      </h2>
                      <div className="flex justify-between items-center text-sm text-gray-700">
                        <span>
                          ราคา: {activity.activity_price.toLocaleString()} บาท
                        </span>
                        <span>ที่ว่าง: {activity.activity_max}</span>
                      </div>
                    </div>

                    {/* คำอธิบายกิจกรรม */}
                    <div className="border border-gray-200 p-3 rounded-lg text-sm text-gray-700 bg-gray-50">
                      {activity.activity_description}
                    </div>

                    {/* วันที่ */}
                    <div className="flex justify-between items-center text-sm font-medium text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <div>
                        เริ่มวันที่:{" "}
                        <span className="text-gray-700 font-normal">
                          {dayjs(activity.activity_start).format("DD MMM YYYY")}
                        </span>{" "}
                        -{" "}
                        <span className="text-gray-700 font-normal">
                          {dayjs(activity.activity_end).format("DD MMM YYYY")}
                        </span>
                      </div>
                      <div className="text-gray-700 font-normal">
                        (
                        {dayjs(activity.activity_end).diff(
                          dayjs(activity.activity_start),
                          "day"
                        ) + 1}{" "}
                        วัน)
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-2 font-bold border-gray-200 rounded-lg flex justify-center p-2">
                  ไม่มีกิจกรรมที่ต้องจัดการ
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Organize;
