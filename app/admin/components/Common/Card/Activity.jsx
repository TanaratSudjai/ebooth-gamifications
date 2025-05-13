"use client";
import React from "react";
import { useRouter } from "next/navigation";
function Activity({
  activity_id,
  activity_name,
  activity_description,
  activity_start,
  activity_end,
  activity_max,
  reward_points,
  organize_id,
  activity_price,
  sub_activity_count,
  id_user = 0,
}) {
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={() => router.push(`/admin/booking/detail/${activity_id}/user/${id_user}`)}
      className="w-full cursor-pointer rounded-lg overflow-hidden shadow-md bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-3">
        <h2 className="font-bold text-lg flex justify-between items-center text-white truncate">
          {activity_name}
          <span className="text-xs font-medium">
            {sub_activity_count} กิจกรรม
          </span>
        </h2>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 p-2">
          {activity_description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-700">
          <div>
            <p className="font-semibold text-gray-800">เริ่ม:</p>
            <p>{formatDate(activity_start)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">สิ้นสุด:</p>
            <p>{formatDate(activity_end)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">จำนวน:</p>
            <p>{activity_max} คน</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">ราคา:</p>
            <p className="text-gray-600 font-medium">
              {activity_price ? `${activity_price} บาท` : "ฟรี"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">คะแนน:</p>
            <p>{reward_points} แต้ม</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">กิจกรรมย่อย:</p>
            <p>{sub_activity_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity;
