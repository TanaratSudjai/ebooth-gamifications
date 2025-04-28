"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import LoadData from "../Load/LoadData";
import { useAlert } from "@/contexts/AlertContext";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { MdNoteAdd, MdDeleteSweep } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
function RewardData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { showSuccess, showError } = useAlert();

  async function fetchData() {
    try {
      const response = await axios.get(
        `/api/reward?page=${page}&limit=${limit}`
      );
      setData(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(true);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/reward/${id}`);
      console.log(res.status);

      setData(data.filter((reward) => reward.id !== id));
      if (res.status === 200) {
        showSuccess("ทำรายการสำเร็จ", "ทำการลบข้อมูลสําเร็จ");
        fetchData();
      } else {
        showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/admin/reward/${id}`;
  };

  return (
    <div className="overflow-x-auto md:overflow-hidden  border mt-10 border-base-content/5 ">
      <table className="table border border-base-content/5 px-3">
        <thead>
          <tr className="text-center bg-gray-200 text-gray-800">
            <th className="px-2 py-2 whitespace-nowrap">ลำดับ</th>
            <th className="px-2 py-2 whitespace-nowrap">ชื่อของรางวัล</th>
            <th className="px-2 py-2 whitespace-nowrap">คะแนนที่ใช้แลก</th>
            <th className="px-2 py-2 whitespace-nowrap">จำนวนของรางวัล</th>
            <th className="px-2 py-2 whitespace-nowrap">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            data.map((reward, index) => (
              <tr
                key={reward.reward_id}
                className="text-center hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="table-cell-style">
                  {index + 1 + (page - 1) * limit}
                </td>

                <td className="table-cell-style">{reward.reward_name}</td>

                <td className="table-cell-style">
                  {reward.reward_point_required} <span className="text-sm text-gray-600">แต้ม</span>
                </td>

                <td className="table-cell-style">
                  {reward.reward_qty_available} <span className="text-sm text-gray-600">ชิ้น</span>
                </td>

                {/* ปุ่ม Edit / Delete */}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="action-button"
                      onClick={() => handleEdit(reward.reward_id)}
                    >
                      <RiFileEditFill />
                    </button>

                    <button
                      className="action-button-del"
                      onClick={() => handleDelete(reward.reward_id)}
                    >
                      <MdDeleteSweep />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="py-10 text-center">
                <LoadData />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination container mx-auto px-10 flex justify-center gap-5 items-center mt-4">
        <button
          className="action-button text-center cursor-pointer"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <MdArrowBackIos />
        </button>
        <span className="text-black font-bold"> หน้า {page}</span>
        <button
          className="action-button text-center cursor-pointer"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
}

export default RewardData;
