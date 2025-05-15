"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "@/contexts/AlertContext";
import LoadData from "../Load/LoadData";
import { useRouter } from "next/navigation";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import Image from "next/image";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { MdNoteAdd, MdDeleteSweep } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
function RankData() {
  const [loading, setLoading] = useState(false);
  const [rank, setRank] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { showSuccess, showError } = useAlert();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/memberRank?page=${page}&limit=${limit}`
      );
      console.log(response.data.data);
      setRank(response.data.data);
      setLoading(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/memberRank/${id}`);
      if (res.status === 200) {
        showSuccess("ทำรายการสำเร็จ", "ทำการลบข้อมูลสําเร็จ");
        fetchData();
      } else {
        showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };
  const handleEdit = (id) => {
    router.push(`/admin/rank/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto md:overflow-hidden  border mt-10  border-base-content/5">
      <table className="table-auto w-full border border-base-content/5 px-3">
        <thead>
          <tr className="text-center bg-gray-200 text-gray-800 text-xs md:text-sm">
            <th className="px-2 py-2 whitespace-nowrap">ลำดับ</th>
            <th className="px-2 py-2 whitespace-nowrap">ชื่อของยศ</th>
            <th className="px-2 py-2 whitespace-nowrap">คะแนนพื้นฐาน</th>
            <th className="px-2 py-2 whitespace-nowrap">สัญลักษณ์</th>
            <th className="px-2 py-2 whitespace-nowrap">จัดการ</th>
          </tr>
        </thead>
        {/*  // table data */}
        <tbody>
          {loading ? (
            rank.map((rank, index) => (
              <tr
                key={rank.member_rank_id}
                className="text-center hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="table-cell-style">
                  {index + 1 + (page - 1) * limit}
                </td>

                <td className="table-cell-style">{rank.member_rank_name}</td>
                <td className="table-cell-style">{rank.member_rank_base}</td>

                {/* โลโก้ */}
                <td className="p-2">
                  <Image
                      src={
                        rank.member_rank_logo.startsWith('/tmp')
                          ? `/api/tmp-image?filename=${rank.member_rank_logo.split('/').pop()}`
                          : rank.member_rank_logo
                      }
                      width={50}
                      height={50}
                      alt="logo"
                      className="rounded-full mx-auto"
                      unoptimized
                    />
                </td>

                {/* ปุ่มแก้ไข-ลบ */}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="action-button"
                      onClick={() => handleEdit(rank.member_rank_id)}
                    >
                      <RiFileEditFill />
                    </button>

                    <button
                      className="action-button-del"
                      onClick={() => handleDelete(rank.member_rank_id)}
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

export default RankData;
