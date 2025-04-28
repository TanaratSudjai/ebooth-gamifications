"use client";
import React from "react";
import BottonAddding from "../components/Common/BottonAddding";
import ActivityData from "../components/Common/Table/ActivityData";
import CommonTextHeaderView from "../components/Common/TextHeader/View";
import BottonQuery from "../components/Common/BottonQuery";
import Image from "next/image";
import { IoIosAddCircle } from "react-icons/io";
function page() {
  return (
    <div>
      <div className="flex flex-col md:flex-col lg:flex-row gap-10 items-center mb-4">
        <BottonAddding
          text="เพิ่มกิจกรรม"
          color="bg-yellow-400"
          part="activity"
        />
        <CommonTextHeaderView text="หน้าจัดการกิจกรรม" dis={true} />
        <div className="flex w-full md:w-auto md:flex-row lg:flex-row flex-col  gap-2">
          <BottonQuery
            text="ยังไม่เปิดรับ"
            color="bg-gray-300"
            params="status off"
          />
          <BottonQuery text="จบเเล้ว" color="bg-pink-300" params="status end" />
          <BottonQuery
            text="กิจกรรมกำลังเริ่มช่วงกิจกรรม"
            color="bg-amber-300"
            params="status processing"
          />
          <div className="flex items-center justify-center text-gray-600 font-medium">
            <IoIosAddCircle />
            {"( ปุ่มเพิ่มกิจกรรมย่อย )"}
          </div>
        </div>
      </div>
      <ActivityData />
    </div>
  );
}

export default page;
