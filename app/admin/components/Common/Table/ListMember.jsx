"use client";
import React from "react";

function ListMember({ data, loading }) {
  return (
    <div className="overflow-x-auto lg:overflow-hidden border mt-10  border-base-content/5">
      {/* <pre>{JSON.stringify(data)}</pre> */}
      <table className="table-auto w-full border border-base-content/5 px-3">
        <thead>
          <tr className="text-left bg-gray-200 text-gray-800 text-xs md:text-sm">
            <th className="px-2 py-2 whitespace-nowrap">ชื่อ-นามสกุล</th>
            <th className="px-2 py-2 whitespace-nowrap">อีเมล</th>
            <th className="px-2 py-2 whitespace-nowrap">ที่อยู่</th>
            <th className="px-2 py-2 whitespace-nowrap">แต้งคงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((member, index) => (
              <tr key={index + 1}>
                <td className="table-cell-style">{member.member_username}</td>
                <td className="table-cell-style">{member.member_email}</td>
                <td className="table-cell-style">{member.member_address}</td>
                <td className="table-cell-style">
                  {member.member_point_remain}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-gray-500"
                      viewBox="0 0 24 24"
                    ></svg>
                    กำลังโหลด...
                  </div>
                ) : (
                  "ไม่พบข้อมูล"
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListMember;
