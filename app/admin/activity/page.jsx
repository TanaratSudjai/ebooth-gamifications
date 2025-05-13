"use client";
import React from "react";
import BottonAddding from "../components/Common/BottonAddding";
import ActivityData from "../components/Common/Table/ActivityData";
import CommonTextHeaderView from "../components/Common/TextHeader/View";
import BottonQuery from "../components/Common/BottonQuery";
import { MdNoteAdd } from "react-icons/md";

function Page() {
  return (
    <div className="p-4">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Left section: Add button + header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <BottonAddding
            text="เพิ่มกิจกรรม"
            color="bg-yellow-400"
            part="activity"
          />
          <CommonTextHeaderView text="หน้าจัดการกิจกรรม" dis={true} />
        </div>

        {/* Right section: Filter buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full lg:w-auto">
          <BottonQuery
            text="ยังไม่เปิดรับ"
            color="bg-gray-300"
            params="status off"
          />
          <BottonQuery
            text="จบเเล้ว"
            color="bg-pink-300"
            params="status end"
          />
          <BottonQuery
            text="กิจกรรมกำลังเริ่มช่วงกิจกรรม"
            color="bg-amber-300"
            params="status processing"
          />
          <div className="flex items-center text-gray-600 font-medium">
            <MdNoteAdd className="mr-1" />
            ( ปุ่มเพิ่มกิจกรรมย่อย )
          </div>
        </div>
      </div>

      {/* Table section */}
      <ActivityData />
    </div>
  );
}

export default Page;
