"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useUserData } from "@/contexts/MemberContext";
import { formatDateToThaiBE } from "@/utils/formatdatelocal";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Page() {
  const { data: session } = useSession();
  const { userData, loading } = useUserData();
  const exp = 1000;

  const r = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* User Info Card */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-800 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">ข้อมูลผู้ใช้งาน</h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
              {/* Username */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">ชื่อบัญชี</span>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-gray-900">
                    {session?.user?.username || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                    {userData?.member?.member_address || "-"}
                  </div>
                </div>
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">อีเมล</span>
                <div className="text-lg font-medium text-gray-800">
                  {session?.user?.email || "N/A"}
                </div>
              </div>
              
              {/* Points */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">คะแนนสะสม</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {userData?.member?.member_point_total || 0}
                  </span>
                  <span className="text-gray-600 font-medium">แต้ม</span>
                </div>
              </div>
              
              {/* Rank */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">ระดับ</span>
                {userData?.member_rank?.member_rank_logo ? (
                  <Image
                    src={userData.member_rank.member_rank_logo}
                    width={80}
                    height={80}
                    alt="ระดับ"
                    className="rounded-xl shadow-md border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">กำลังโหลด...</span>
                  </div>
                )}
              </div>
            </div>

            {/* EXP Bar */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-700">ประสบการณ์</span>
                <span className="text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  {userData?.member?.member_exp || 0} / {exp} EXP
                </span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-gray-800 h-full transition-all duration-700 ease-out rounded-full"
                  style={{
                    width: `${Math.min(
                      (userData?.member?.member_exp / exp) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-12 bg-gray-800 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">กิจกรรมที่เข้าร่วม</h2>
          </div>
          
          <div className="space-y-6">
            {loading || !userData?.activity ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 font-medium">กำลังโหลดข้อมูลกิจกรรม...</p>
              </div>
            ) : userData.activity.length > 0 ? (
              userData.activity.map((act, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      {/* Activity Name */}
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">ชื่อกิจกรรม</span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {act.activity_name}
                        </h3>
                      </div>
                      
                      {/* Check-in Time */}
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">เวลาเข้าร่วม</span>
                        <div className="text-lg font-medium text-gray-800">
                          {formatDateToThaiBE(act.checkin_time)}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">สถานะเช็คอิน</span>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${
                          act.is_checkin === 0 
                            ? "bg-gray-100 text-gray-700 border-gray-300" 
                            : "bg-gray-800 text-white border-gray-800"
                        }`}>
                          {act.is_checkin === 0 ? "ยังไม่เช็คอิน" : "เช็คอินแล้ว"}
                        </div>
                      </div>
                    </div>

                    {act.activity?.subactivities?.length > 0 && (
                      <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <p className="font-bold text-lg text-gray-700 mb-4">กิจกรรมย่อย</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {act.activity.subactivities.map((sub, subIndex) => (
                            <div key={subIndex} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                <span className="font-medium text-gray-800">{sub.sub_activity_name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-200">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-700 mb-2">ไม่มีกิจกรรมที่เข้าร่วม</p>
                <p className="text-lg text-gray-500">เริ่มจองกิจกรรมแรกของคุณได้เลย!</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Button */}
        <div className="flex justify-center pt-8 pb-16">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => r.push("/member/activity_member")}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-5 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xl border border-gray-700"
          >
            จองกิจกรรมเพิ่ม
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Page;