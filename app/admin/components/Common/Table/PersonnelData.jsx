"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import LoadData from "../Load/LoadData";
import { useAlert } from "@/contexts/AlertContext";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { MdNoteAdd, MdDeleteSweep } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";

function PersonnelData({ search = "" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { showSuccess, showError } = useAlert();
  const [searchQuery, setSearchQuery] = useState(search);

  const [filteredData, setFilteredData] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(
        `/api/personnel?page=${page}&limit=${limit}`
      );
      setData(response.data.data);
      setFilteredData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(true);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    setSearchQuery(search);
    fetchData();
  }, [page, limit]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.personnel_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
    setPage(1);
  }, [search, data]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  const handleDelete = async (id) => {
    try {
      const res_delete = await axios.delete(`/api/personnel/${id}`);
      if (res_delete.status === 200) {
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
    window.location.href = `/admin/personnel/${id}`;
  };

  return (
    <div className="overflow-x-auto md:overflow-hidden  border mt-10 border-base-content/5 ">
      <table className="table border border-base-content/5 px-3">
        <thead>
          <tr className="text-center bg-gray-200 text-gray-800 text-xs md:text-sm">
            <th className="px-2 py-2 whitespace-nowrap">รหัสบุคลากร</th>
            <th className="px-2 py-2 whitespace-nowrap">ชื่อบุคลากร</th>
            <th className="px-2 py-2 whitespace-nowrap">ที่อยู่</th>
            <th className="px-2 py-2 whitespace-nowrap">เบอร์โทร</th>
            <th className="px-2 py-2 whitespace-nowrap">อีเมล</th>
            <th className="px-2 py-2 whitespace-nowrap">รายละเอียด</th>
            <th className="px-2 py-2 whitespace-nowrap">ชื่อผู้ใช้</th>
            <th className="px-2 py-2 whitespace-nowrap">รหัสหน่วยงาน</th>
            <th className="px-2 py-2 whitespace-nowrap">การจัดการ</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            filteredData.map((personnel, index) => (
              <tr
                key={personnel.personnel_id}
                className="text-center hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="table-cell-style">
                  {index + 1 + (page - 1) * limit}
                </td>
                <td className="table-cell-style">{personnel.personnel_name}</td>
                <td className="table-cell-style">
                  {personnel.personnel_address}
                </td>
                <td className="table-cell-style">{personnel.personnel_tel}</td>
                <td className="table-cell-style">
                  {personnel.personnel_email}
                </td>
                <td className="table-cell-style">
                  {personnel.personnel_description}
                </td>
                <td className="table-cell-style">
                  {personnel.personnel_username}
                </td>

                <td className="text-black font-normal">
                  {personnel.organize_name || "ไม่ระบุ"}
                </td>

                {/* ปุ่ม Edit / Delete */}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-2">
                    {/* Edit Button */}
                    <button
                      className="action-button"
                      onClick={() => handleEdit(personnel.personnel_id)}
                    >
                      <RiFileEditFill />
                    </button>

                    {/* Delete Button */}
                    <button
                      className="action-button-del "
                      onClick={() => handleDelete(personnel.personnel_id)}
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
        <span className="text-black font-bold">
          {" "}
          หน้า {page} / {totalPages || 1}
        </span>
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

export default PersonnelData;
