"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import BottonBooking from "@/app/admin/components/Common/BottonBooking";

function Member({ id = "" }) {
  const [member, setMember] = useState([]);
  const [checkIn, setCheckIn] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/checkin/${id}`);
      setMember(response.data.data);
      setCheckIn(response.data.data.member.checkin);
      console.log(response.data.data.member.checkin);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id != 0 || id !== "") {
      fetchData();
    }
  }, [id]);

  return (
    <div className="w-full mx-auto p-5">
      {!loading && member?.member && (
        <div className="container mx-auto flex flex-col md:flex-row gap-2 ">
          <div className="w-full h-auto p-3 rounded-lg  ">
            <div className="flex flex-col gap-2 items-center justify-center ">
              <>
                <div className="flex w-full flex-col md:flex-row items-center justify-start gap-2">
                  <div className="text-2xl w-[100%] font-bold border px-5 rounded-md flex justify-start border-gray-300">
                    {member.member.member_username}
                  </div>
                  <div className="text-gray-600 w-[100%]">
                    {member.member.member_email}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full justify-start rounded-lg p-2 border border-gray-300">
                  <div className="text-gray-600 flex gap-2">
                    <span className="font-bold">ที่อยู่</span>
                    {member.member.member_address}
                  </div>
                  <div className="text-gray-600 flex gap-2">
                    <span className="font-bold">แต้ม</span>
                    {member.member.member_point_remain} {"/"}{" "}
                    {member.member.member_point_total}
                  </div>
                  <div className="text-gray-600 flex gap-2">
                    {member.member.member_rank_logo ? (
                      <Image
                        className="rounded-full p-2"
                        src={member.member.member_rank_logo}
                        width={60}
                        height={60}
                        alt="member rank"
                      />
                    ) : null}
                  </div>
                </div>
              </>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 overflow-y-auto max-h-[800px]  p-3  rounded-xl border border-gray-300 ">
            {Array.isArray(checkIn) && checkIn.length > 0 ? (
              checkIn.map((checkIn, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-2 border-2 border-amber-300 shadow-lg  rounded-lg "
                >
                  <div className="bg-amber-300 flex flex-col border-2 border-gray-200 shadow-md px-2 py-3 rounded-lg ">
                    {checkIn.activity_name}
                    <span className="text-gray-600 flex gap-2">
                      {checkIn.sub_activity_name}

                      <div className="font-bold">
                        {"( " + checkIn.sub_activity_max + " )"}
                      </div>
                    </span>
                  </div>
                  <div className="border-2 border-gray-200 rounded-lg shadow-md">
                    <div className=" border-gray-200 rounded-lg p-2">
                      {checkIn.sub_activity_description}
                    </div>
                    <div className=" border-gray-200 flex justify-between items-center  rounded-lg p-1 text-amber-500 font-bold">
                      <div className="">
                        <span className="text-gray-600">
                          จำนวนที่นั่งเหลือ{" "}
                        </span>
                        {checkIn.activity_max}
                      </div>
                      {/* components */}
                      <button className="bg-primary  text-white px-3 py-1 rounded-lg cursor-pointer hover:scale-105 transform  transition duration-300 ease-in-out">
                        เช็คอิน
                      </button>
                      {/* components */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border-2 font-bold border-gray-200 rounded-lg flex justify-center p-2">
                ยังไม่เข้าร่วมกิจกรรม
              </div>
            )}
            <div className="flex  justify-center">
              <BottonBooking id={id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Member;
