"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useUserData } from '@/contexts/MemberContext';
import { formatDateToThaiBE } from '@/utils/formatdatelocal';
import { motion } from 'framer-motion';
function Page() {
  const { data: session } = useSession();
  const { userData, loading } = useUserData();
  console.log(userData || 0);
  const exp = 1000

  return (
    <motion.div initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className='container mx-auto flex flex-col gap-2'>

      <div className="text-lg font-bold bg-white shadow-md p-3  text-gray-800 rounded-sm flex flex-col gap-2">
        <span className="uppercase text-md "><span className='w-24'>ชื่อบัญชี:</span> {session?.user?.username || 'N/A'} {`( ${userData?.member?.member_address} )`}</span>
        <span className=" text-md"><span className='w-24'>ชื่อผู้ใช้:</span> {session?.user?.email || 'N/A'}</span>
        <span className="uppercase text-md "><span className='w-24'>คะแนน:</span> {userData?.member?.member_point_total} แต้ม</span>
        <div className="w-full max-w-xs">
          <span className="uppercase text-md block mb-1">
            EXP: {userData?.member?.member_exp} / {exp}
          </span>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-300"
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

      <div className="font-bold text-gray-800">กิจกรรมที่เข้าร่วม</div>
      <div className="flex flex-col gap-2">
        {userData?.activity && userData.activity.length > 0 ? (
          userData.activity.map((act, index) => (
            <div
              key={index}
              className="text-lg font-bold bg-white shadow-md p-3 border-l-6 border-gray-800 text-gray-800 rounded-sm flex flex-col gap-2"
            >
              <p className="font-semibold">กิจกรรม: {act.activity_name}</p>
              <p className="text-sm text-gray-600">
                เวลาเข้าร่วมงาน: {formatDateToThaiBE(act.checkin_time)}
              </p>
              <p className="text-sm text-gray-600">
                {act.is_checkin === 0 ? "ยังไม่เช็คอิน" : "เช็คอินแล้ว"}
              </p>
            </div>
          ))
        ) : (
          <div className="text-lg font-bold bg-white shadow-md p-3 border-l-6 border-gray-800 text-gray-800 rounded-sm flex flex-col gap-2">
            กำลังโหลดข้อมูล...
          </div>
        )}

        <div className="flex w-full justify-center">
          <div className="w-auto px-3 flex justify-center mt-2 border-white shadow-xl text-gray-800 bg-amber-300 border-2 rounded-2xl py-2 cursor-pointer hover:bg-amber-400 transition">
            จองกิจกรรมเพิ่ม
          </div>
        </div>
      </div>


    </motion.div>
  );
}

export default Page;
