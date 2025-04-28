"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useAlert } from "@/contexts/AlertContext";
import LoadData from "../Load/LoadData";
import { useRouter } from "next/navigation";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
function ActivityData() {
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { showSuccess, showError } = useAlert();
  const { subactivity, setSubActivity } = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  const openModal = (id) => {
    setSelectedId(id);
    document.getElementById("my_modal_1").showModal();
  };

  const [formData, setFormData] = useState({
    member_username: "",
    member_email: "",
    member_password: "",
    member_address: "",
  });

  const payloadMember = {
    member_username: formData.member_username,
    member_email: formData.member_email,
    member_password: formData.member_password,
    member_address: formData.member_address,
  };

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(payloadMember);
      console.log(selectedId);
      const res = await axios.post("/api/user/profile", payloadMember);
      console.log(res);
      if (res.status === 201) {
        showSuccess("ทำรายการสำเร็จ", "ทำการเพิ่มข้อมูลสําเร็จ");
        fetchData();
      } else {
        showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }
    } catch (error) {
      setError(error);
    }
  };

  async function fetchData() {
    try {
      const response = await axios.get(
        `/api/user/profile?page=${page}&limit=${limit}`
      );
      console.log(response.data.data);

      setMember(response.data.data);
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
      const res = await axios.delete(`/api/user/profile/${id}`);
      setMember(member.filter((member) => member.id !== id));
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
    router.push(`/admin/member/${id}`);
  };

  const handleDetail = (id) => {
    router.push(`/admin/member/detail/${id}`);
  };

  return (
    <div className="overflow-x-auto md:overflow-hidden   border mt-10  border-base-content/5">
      {/* table */}
      <table className="table border border-base-content/5 px-3">
        <thead>
          <tr className="text-center bg-gray-200 text-gray-800 ">
            <th className="px-2 py-2 whitespace-nowrap">ลําดับ</th>
            <th className="px-2 py-2 whitespace-nowrap">ชื่อ</th>
            <th className="px-2 py-2 whitespace-nowrap">อีเมล</th>

            <th className="px-2 py-2 whitespace-nowrap">ประสบการณ์</th>
            <th className="px-2 py-2 whitespace-nowrap">ยศ</th>

            {/* <th className="px-2 py-2 whitespace-nowrap">ที่อยู่</th> */}
            <th className="px-2 py-2 whitespace-nowrap">แต้มทั้งหมด</th>
            <th className="px-2 py-2 whitespace-nowrap">แต้มคงเหลือ</th>
            <th className="px-2 py-2 whitespace-nowrap">จัดการ</th>
          </tr>
        </thead>
        {/*  // table data */}
        <tbody>
          {loading ? (
            member.map((member, index) => (
              <tr
                key={member.member_id}
                onClick={() => handleDetail(member.member_id)}
                className="text-center hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="table-cell-style">
                  {index + 1 + (page - 1) * limit}
                </td>
                <td className="table-cell-style">{member.member_username}</td>
                <td className="table-cell-style">{member.member_email}</td>
                <td className="table-cell-style">{member.member_exp}</td>
                <td className="table-cell-style flex justify-center">
                  {member.member_rank_logo ? (
                    <Image
                      src={member.member_rank_logo}
                      alt="logo-rank"
                      className=""
                      width={50}
                      height={50}
                    />
                  ) : (
                    <div className="">ไม่มียศ</div>
                  )}
                </td>
                {/* <td className="table-cell-style">{member.member_address}</td> */}
                <td className="table-cell-style">
                  {member.member_point_total}
                </td>
                <td className="table-cell-style">
                  {member.member_point_remain}
                </td>

                {/* ปุ่มแก้ไข / ลบ */}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-2">
                    {/* Edit */}
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(member.member_id);
                      }}
                    >
                      <RiFileEditFill />
                    </button>

                    {/* Delete */}
                    <button
                      className="action-button-del "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(member.member_id);
                      }}
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

      {/* btn pagination */}
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

export default ActivityData;
