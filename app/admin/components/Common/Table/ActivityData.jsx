"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import { useAlert } from "@/contexts/AlertContext";
import LoadData from "../Load/LoadData";
import { useRouter } from "next/navigation";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { MdNoteAdd, MdDeleteSweep } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toSQLDatetimeFormat } from "@/utils/formatdatelocal";
function ActivityData() {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [subactivity, setSubActivity] = useState([]);

  const { showSuccess, showError } = useAlert();
  const router = useRouter();

  const openModal = (id) => {
    setSelectedId(id);
    document.getElementById("my_modal_1").showModal();
  };
  const [formData, setFormData] = useState({
    sub_activity_name: "",
    sub_activity_description: "",
    sub_activity_start: "",
    sub_activity_end: "",
    sub_activity_max: 1,
    sub_activity_point: 1,
    sub_activity_price: 1,
  });

  // _-----
  const payloadSubactivity = {
    activity_id: parseInt(selectedId),
    sub_activity_name: formData.sub_activity_name,
    sub_activity_description: formData.sub_activity_description,
    // แปลงวันที่ให้เป็นฟอร์แมตที่ MySQL รองรับ (YYYY-MM-DD HH:MM:SS)
    sub_activity_start: toSQLDatetimeFormat(formData.sub_activity_start), // ใช้เพื่อแปลงก่อนส่งไปฐานข้อมูล
    sub_activity_end: toSQLDatetimeFormat(formData.sub_activity_end),
    sub_activity_max: Number(formData.sub_activity_max),
    sub_activity_point: Number(formData.sub_activity_point),
    sub_activity_price: Number(formData.sub_activity_price),
  };

  // _-----
  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // /api/subActivity POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(payloadSubactivity);
      // console.log(selectedId);
      const res = await axios.post("/api/subActivity", payloadSubactivity);
      console.log(res);
      if (res.status === 201) {
        showSuccess("ทำรายการสำเร็จ", "ทำการเพิ่มข้อมูลสําเร็จ");
        document.getElementById("my_modal_1").close();
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
        `/api/activity?page=${page}&limit=${limit}`
      );
      console.log(response.data.data);
      setActivityData(response.data.data);
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

  {
    // make btn confirm
  }
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/activity/${id}`);
      setActivityData(activityData.filter((activity) => activity.id !== id));
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
    window.location.href = `/admin/activity/${id}`;
  };
  const toSubActivity = (id) => {
    router.push(`/admin/subactivity/${id}`);
  };

  return (
    <div className="overflow-x-auto md:overflow-hidden   border mt-10  border-base-content/5">
      {/* table */}

      <table className="table-auto w-full border border-base-content/5 px-3">
        <thead>
          <tr className="text-center bg-gray-200 text-gray-800 text-xs md:text-sm">
            <th className="px-2 py-2 whitespace-nowrap">ลำดับ</th>
            <th className="px-2 py-2 whitespace-nowrap">วันเริ่มกิจกรรม</th>
            <th className="px-2 py-2 whitespace-nowrap">ชื่อกิจกรรม</th>

            <th className="px-2 py-2 whitespace-nowrap hidden md:block">
              จำนวนผู้เข้าร่วมสูงสุด
            </th>
            {/* <th className="px-2 py-2 whitespace-nowrap">คะแนนสะสม</th> */}
            {/* <th className="px-2 py-2 whitespace-nowrap">เป็นกิจกรรมหลายวัน</th> */}
            <th className="px-2 py-2 whitespace-nowrap ">
              ชื่อหน่วยงานจัดกิจกรรม
            </th>
            <th className="px-2 py-2 whitespace-nowrap">ราคา</th>
            <th className="px-2 py-2 whitespace-nowrap ">จำนวนกิจกรรมย่อย</th>
            <th className="px-2 py-2 whitespace-nowrap">จัดการ</th>
          </tr>
        </thead>
        {/*  // table data */}
        <tbody>
          {loading ? (
            activityData.map((activity, index) => (
              <tr
                key={activity.activity_id}
                className="text-center hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-all duration-300 hover:scale-[1.01]"
                onClick={() => toSubActivity(activity.activity_id)}
              >
                {/* หมายเลขลำดับ */}
                <td className="table-cell-style">
                  {index + 1 + (page - 1) * limit}
                </td>

                {/* วันที่ */}
                <td className="table-cell-style">
                  {dayjs(activity.activity_start).format("DD/MM/YYYY HH:mm")}
                  <br />
                  <span className="text-gray-500 text-xs">
                    ระยะเวลา:{" "}
                    {dayjs(activity.activity_end).diff(
                      dayjs(activity.activity_start),
                      "day"
                    )}{" "}
                    วัน
                  </span>
                </td>

                {/* ชื่อกิจกรรม */}
                <td className="table-cell-style">{activity.activity_name}</td>

                {/* รายละเอียด */}
                {/* <td className="table-cell-style">
                  {activity.activity_description}
                </td> */}

                {/* จำกัดจำนวน */}
                <td className="table-cell-style hidden md:block">
                  {activity.activity_max > 999
                    ? "ไม่จำกัดผู้เข้าร่วม"
                    : `${activity.activity_max} คน`}
                </td>

                {/* หน่วยงาน */}
                <td className="table-cell-style  ">
                  {activity.organize_name || (
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(activity.activity_id);
                      }}
                    >
                      <IoPersonAddSharp />
                    </button>
                  )}
                </td>

                {/* ราคา */}
                <td className="table-cell-style">
                  {activity.activity_price + " บาท"}
                </td>

                {/* จำนวนกิจกรรมย่อย */}
                <td className="table-cell-style ">
                  {activity.sub_activity_count || (
                    <button
                      className="action-button-add"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(activity.activity_id);
                      }}
                    >
                      <MdNoteAdd />
                    </button>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                    {/* Edit */}
                    <button
                      className="action-button"
                      onClick={() => handleEdit(activity.activity_id)}
                    >
                      <RiFileEditFill />
                    </button>

                    {/* Delete */}
                    <button
                      className=" action-button-del"
                      onClick={() => handleDelete(activity.activity_id)}
                    >
                      <MdDeleteSweep />
                    </button>

                    {!activity.sub_activity_count ||
                      activity.sub_activity_count === 0 ? (
                      <div className=""></div>
                    ) : (
                      <button
                        className="action-button-add"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(activity.activity_id);
                        }}
                      >
                        <MdNoteAdd />
                      </button>
                    )}
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
      {/* dialog form */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white ">
          <div className="flex justify-center items-center mb-6">
            <CommonTextHeaderView text="เพิ่มกิจกรรมย่อย" dis={true} />
          </div>
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-2"
          >
            <label className="w-full max-w-full">
              ชื่อกิจกรรมย่อย
              <input
                required
                type="text"
                placeholder="ชื่อกิจกรรมย่อย"
                className="border border-gray-200 p-1 md:p-2 rounded-lg w-full"
                onChange={onChange}
                value={formData.sub_activity_name}
                name="sub_activity_name"
              />
            </label>

            <label className="w-full max-w-full">
              คำอธิบาย
              <input
                required
                type="text"
                placeholder="คำอธิบาย"
                className="border border-gray-200 p-1 md:p-2 rounded-lg w-full"
                onChange={onChange}
                value={formData.sub_activity_description}
                name="sub_activity_description"
              />
            </label>

            <label className="w-full max-w-full flex flex-col">
              เวลาเริ่ม
              <DatePicker
                selected={
                  formData.sub_activity_start
                    ? new Date(formData.sub_activity_start)
                    : null
                }
                onChange={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    sub_activity_start: date,
                  }));
                }}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                className="text-black p-2 border border-gray-300 rounded-lg w-full"
                required
                placeholderText="กรูณาเลือกเวลา"
              />
            </label>

            <label className="w-full max-w-full flex flex-col">
              เวลาสิ้นสุด
              <DatePicker
                selected={
                  formData.sub_activity_end
                    ? new Date(formData.sub_activity_end)
                    : null
                }
                onChange={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    sub_activity_end: date,
                  }));
                }}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                className="text-black p-2 border border-gray-300 rounded-lg w-full"
                required
                placeholderText="กรูณาเลือกเวลา"
              />
            </label>

            <label className="w-full max-w-full">
              จำนวนคน
              <input
                required
                type="text"
                placeholder="จำนวนคน"
                className="border border-gray-200 p-1 md:p-2 rounded-lg w-full"
                onChange={onChange}
                value={formData.sub_activity_max}
                name="sub_activity_max"
              />
            </label>

            <label className="w-full max-w-full">
              คะแนนรางวัล
              <input
                required
                type="text"
                placeholder="คะแนนรางวัล"
                className="border border-gray-200 p-1 md:p-2 rounded-lg w-full"
                onChange={onChange}
                value={formData.sub_activity_point}
                name="sub_activity_point"
              />
            </label>

            <label className="w-full max-w-full">
              ราคา
              <input
                required
                type="number"
                placeholder="ราคา"
                className="border border-gray-200 p-1 md:p-2 rounded-lg w-full"
                onChange={onChange}
                value={formData.sub_activity_price}
                name="sub_activity_price"
              />
            </label>

            <button className="btn w-full mt-2" type="submit">
              เพิ่ม
            </button>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">ยกเลิก</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ActivityData;
