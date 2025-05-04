"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import BottonBooking from "@/app/admin/components/Common/BottonBooking";
import {
  UserCircle,
  Mail,
  MapPin,
  Award,
  Calendar,
  Users,
  CalendarSearch,
} from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";
function Member({ id = "" }) {
  const [member, setMember] = useState([]);
  const [checkIn, setCheckIn] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess, showWarning } = useAlert();
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

  const handleCheckIn = async (ac_id) => {
    try {
      const response = await axios.put(
        `/api/checkin/updateCheckin/onActivity`,
        { member_id: member, activity_id: ac_id }
      );
      if (response.status === 200) {
        showSuccess("เช็คชื่อสำเร็จ", "เชิญเข้าร่วมงานได้เลยครับ!");
      } else {
        showError("เช็คชื่อผิดพลาด", "กรุณารอสักครู่!");
      }
    } catch (err) {
      console.log(err.message);
      showError("เช็คชื่อผิดพลาด", "กรุณารอสักครู่!");
    }
  };

  useEffect(() => {
    if (id != 0 && id !== "") {
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

  if (!member?.member) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-lg text-gray-600">ไม่พบข้อมูลสมาชิก</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Member details card - Left side */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <UserCircle size={64} className="text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {member.member.member_username}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail size={16} className="mr-1" />
                  <span>{member.member.member_email}</span>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-start">
                  <MapPin
                    className="mr-2 text-amber-500 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div>
                    <span className="font-medium text-gray-700">ที่อยู่:</span>
                    <p className="text-gray-600">
                      {member.member.member_address || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Award className="mr-2 text-amber-500" size={18} />
                  <div>
                    <span className="font-medium text-gray-700">แต้มสะสม:</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-amber-500">
                        {member.member.member_point_remain}
                      </span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-gray-600">
                        {member.member.member_point_total}
                      </span>
                    </div>
                  </div>
                </div>

                {member.member.member_rank_logo && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">
                      ระดับสมาชิก:
                    </span>
                    <div className="relative">
                      <Image
                        src={member.member.member_rank_logo}
                        width={48}
                        height={48}
                        alt="member rank"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Check-in history - Right side */}
        <div className="md:col-span-2">
          <div className=" bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="mr-2 text-amber-500" />
                กิจกรรมที่เข้าร่วม
              </h3>
            </div>

            <div className=" p-4 overflow-y-auto max-h-[600px]">
              {Array.isArray(checkIn) && checkIn.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {checkIn.map((checkIn, index) => (
                    <div
                      key={index}
                      className=" bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="bg-amber-100 px-4 py-3 rounded-t-lg">
                        <h4 className="font-bold text-gray-800">
                          {checkIn.activity_name}
                        </h4>
                        <div className="flex items-center text-gray-700 text-sm mt-1">
                          <span className="bg-amber-200 text-amber-800 text-xs font-medium px-2 py-0.5 rounded ">
                            {checkIn.activity_max} ที่นั่ง
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-3">
                          {checkIn.activity_description}
                        </p>

                        {/* call data subactivity */}
                        {checkIn.sub_activities &&
                        checkIn.sub_activities.length > 0 ? (
                          <div className="text-yellow-500">
                            <p>กิจกรรมย่อย:</p>
                            <ul className="list-disc pl-5">
                              {checkIn.sub_activities.map((sub, index) => (
                                <li key={index}>
                                  {sub.sub_activity_name}{" "}
                                  <span className="text-gray-500 text-xs">
                                    (
                                    {new Date(
                                      sub.checkin_time
                                    ).toLocaleString()}
                                    )
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="text-red-600">ไม่มีกิจกรรมย่อย</div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm">
                            <Users size={16} className="text-amber-500 mr-1" />
                            <span className="text-gray-600">
                              จำนวนที่นั่งเหลือ:{" "}
                            </span>
                            <span className="font-bold text-amber-500 ml-1">
                              {checkIn.activity_max}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCheckIn(checkIn.activity_id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                          >
                            เช็คอิน
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Calendar size={48} className="text-gray-300 mb-2" />
                  <p className="font-medium">ยังไม่เข้าร่วมกิจกรรม</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-center">
                <BottonBooking id={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Member;
