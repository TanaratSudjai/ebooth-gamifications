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
      className="container mx-auto px-4 py-6 space-y-8"
    >
      {/* User Info */}
      <section className="bg-white border-l-4 border-amber-500 rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          👤 ข้อมูลผู้ใช้งาน
        </h2>
        <div className="space-y-2 text-gray-700 text-md">
          <p>
            <span className="font-semibold">ชื่อบัญชี:</span>{" "}
            {session?.user?.username || "N/A"}{" "}
            <span className="text-sm text-gray-500">
              ({userData?.member?.member_address || "-"})
            </span>
          </p>
          <p>
            <span className="font-semibold">อีเมล:</span>{" "}
            {session?.user?.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold">คะแนนสะสม:</span>{" "}
            <span className="text-amber-500 font-semibold">
              {userData?.member?.member_point_total || 0}
            </span>{" "}
            แต้ม
          </p>
          <div>
            <span className="font-semibold">ระดับ:</span>{" "}
            {userData?.member_rank?.member_rank_logo ? (
              <Image
                src={userData.member_rank.member_rank_logo}
                width={80}
                height={80}
                alt="ระดับ"
                className="inline-block ml-2"
              />
            ) : (
              <span className="text-sm text-gray-400 ml-2">กำลังโหลด...</span>
            )}
          </div>
        </div>

        {/* EXP Bar */}
        <div className="max-w-md mt-4">
          <p className="text-sm text-gray-600 font-medium mb-1">
            EXP: {userData?.member?.member_exp || 0} / {exp}
          </p>
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (userData?.member?.member_exp / exp) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          🎯 กิจกรรมที่เข้าร่วม
        </h2>
        <div className="flex flex-col gap-4">
          {loading || !userData?.activity ? (
            <div className="bg-white rounded-xl shadow p-4 text-center text-gray-500">
              ⏳ กำลังโหลดข้อมูลกิจกรรม...
            </div>
          ) : userData.activity.length > 0 ? (
            userData.activity.map((act, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-5 border-l-4 border-gray-800 space-y-2"
              >
                <h3 className="font-semibold text-lg text-gray-900">
                  📌 {act.activity_name}
                </h3>
                <p className="text-sm text-gray-600">
                  🕒 เวลาเข้าร่วม: {formatDateToThaiBE(act.checkin_time)}
                </p>
                <p className="text-sm">
                  ✅ สถานะเช็คอิน:{" "}
                  <span
                    className={
                      act.is_checkin === 0
                        ? "text-red-500"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {act.is_checkin === 0 ? "ยังไม่เช็คอิน" : "เช็คอินแล้ว"}
                  </span>
                </p>

                {act.activity?.subactivities?.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="font-semibold">📂 กิจกรรมย่อย:</p>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {act.activity.subactivities.map((sub, subIndex) => (
                        <li key={subIndex}>{sub.sub_activity_name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-4 text-center text-gray-500">
              ไม่มีกิจกรรมที่เข้าร่วม
            </div>
          )}
        </div>
      </section>

      {/* Button */}
      <div className="flex justify-center mb-50">
        <button
          onClick={() => r.push("/member/activity_member")}
          className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300"
        >
          ➕ จองกิจกรรมเพิ่ม
        </button>
      </div>
    </motion.div>
  );
}

export default Page;
