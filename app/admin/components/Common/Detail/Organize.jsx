"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import {
  Building2,
  MapPin,
  FileText,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";

function Organize({ id = "" }) {
  const [organize, setOrganize] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      if (id !== 0) {
        const response = await axios.get(`/api/organize/organizeDetail/${id}`);
        setOrganize(response.data);
        setActivity(response.data.organize.activity);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const henddleToaddActivity = async (id) => {
    sessionStorage.setItem("activityId", id);
    router.push("/admin/activity/0");
  };

  useEffect(() => {
    if (id && id !== 0) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-lg">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!organize?.organize) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-lg text-gray-600">ไม่พบข้อมูลองค์กร</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organize details card - Left side */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Building2 className="mr-2 text-amber-500" />
                ข้อมูลองค์กร
              </h2>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {organize.organize.organize_name}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin
                    className="mr-2 text-amber-500 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div className="">
                    <span className="font-medium text-gray-700">ที่อยู่: {organize.organize.organize_address || "-"}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText
                    className="mr-2 text-amber-500 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div>
                    <span className="font-medium text-gray-700">
                      รายละเอียด:  {organize.organize.organize_description || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="mr-2 text-amber-500" size={18} />
                  <div>
                    <span className="font-medium text-gray-700">ติดต่อ:</span>
                    <span className="text-gray-600 ml-1">
                      {organize.organize.organize_tel || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities grid - Right side */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="mr-2 text-amber-500" />
                กิจกรรมทั้งหมด
              </h3>
            </div>

            <div className="p-4 overflow-y-auto max-h-[700px]">
              {Array.isArray(activity) && activity.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.map((activity, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        router.push(`/admin/organize/list_member/${activity.activity_id}`);
                      }}
                      className="   bg-white border-none border-gray-20 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="bg-amber-100 px-4 py-3 rounded-t-lg">
                        <h4
                          className="font-bold text-gray-800 text-lg truncate"
                          title={activity.activity_name}
                        >
                          {activity.activity_name}
                        </h4>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="text-sm text-gray-600 max-h-24 overflow-y-auto">
                          {activity.activity_description}
                        </div>

                        <div className="flex items-center text-sm border-t border-gray-100 pt-3">
                          <DollarSign
                            size={16}
                            className="text-amber-500 mr-1"
                          />
                          <span className="text-gray-700">ราคา: </span>
                          <span className="font-semibold text-amber-600 ml-1">
                            {activity.activity_price.toLocaleString()} บาท
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <Users size={16} className="text-amber-500 mr-1" />
                          <span className="text-gray-700">ที่ว่าง: </span>
                          <span className="font-semibold text-amber-600 ml-1">
                            {activity.activity_max}
                          </span>
                        </div>

                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                          <div className="flex items-center text-sm">
                            <Clock size={16} className="text-amber-500 mr-1" />
                            <span className="text-gray-700">ระยะเวลา: </span>
                            <span className="font-semibold text-amber-600 ml-1">
                              {dayjs(activity.activity_end).diff(
                                dayjs(activity.activity_start),
                                "day"
                              ) + 1}{" "}
                              วัน
                            </span>
                          </div>

                          <div className="text-xs text-gray-600 mt-1">
                            <span>
                              {dayjs(activity.activity_start).format(
                                "DD MMM YYYY"
                              )}
                            </span>
                            <span className="mx-1">-</span>
                            <span>
                              {dayjs(activity.activity_end).format(
                                "DD MMM YYYY"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Calendar size={48} className="text-gray-300 mb-2" />
                    <p className="font-medium">ไม่มีกิจกรรมที่ต้องจัดการ</p>
                    <button
                      className="btn bg-amber-300 hover:bg-amber-400 hover:scale-102 border-none rounded-md transform transition duration-200 ease-in-out text-black mt-4"
                      onClick={() => henddleToaddActivity(id)}
                    >
                      เพิ่มกิจกรรม
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Calendar size={48} className="text-gray-300 mb-2" />
                  <p className="font-medium">ไม่มีกิจกรรมที่ต้องจัดการ</p>
                  <button
                    className="btn bg-amber-300 hover:bg-amber-400 hover:scale-102 border-none rounded-md transform transition duration-200 ease-in-out text-black mt-4"
                    onClick={() => henddleToaddActivity(id)}
                  >
                    เพิ่มกิจกรรม
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organize;
