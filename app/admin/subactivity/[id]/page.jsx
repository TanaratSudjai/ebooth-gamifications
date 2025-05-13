"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAlert } from "@/contexts/AlertContext";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import {
  toDatetimeLocalString,
  toSQLDatetimeFormat,
} from "@/utils/formatdatelocal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function page() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  // state
  const [subActivity, setSubActivity] = useState([]);
  const [activity, setActivity] = useState({});
  const { showSuccess, showError } = useAlert();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdSub, setSelectedIdSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    sub_activity_name: "",
    sub_activity_description: "",
    sub_activity_start: "",
    sub_activity_end: "",
    sub_activity_max: 1,
    sub_activity_point: 1,
    sub_activity_price: 1,
  });

  const payloadSubactivity = {
    activity_id: parseInt(id),
    sub_activity_name: formData.sub_activity_name,
    sub_activity_description: formData.sub_activity_description,
    sub_activity_start: toSQLDatetimeFormat(formData.sub_activity_start),
    sub_activity_end: toSQLDatetimeFormat(formData.sub_activity_end),
    sub_activity_max: Number(formData.sub_activity_max),
    sub_activity_point: Number(formData.sub_activity_point),
    sub_activity_price: Number(formData.sub_activity_price),
  };

  // call api to get data function
  const fetchData = async () => {
    try {
      const res_sub = await axios.get(
        `/api/subActivity/getSubByActivity/${id}`
      );

      setSubActivity(res_sub.data.data);
      setLoading(false);
      // console.log(res_sub.data);
    } catch (err) {
      showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const fetchMain = async () => {
    try {
      const res_main = await axios.get(`/api/activity/${id}`);
      setActivity(res_main.data);
      console.log("main data : ", res_main.data);
      console.log("id : ", id);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchDataOil = async () => {
    try {
      const res_sub = await axios.get(`/api/subActivity/${selectedIdSub}`);
      setFormData(res_sub.data);
      setLoading(false);
    } catch (err) {
      showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(selectedId);
      const res = await axios.put(
        `/api/subActivity/${selectedIdSub}`,
        payloadSubactivity
      );
      console.log(res);
      if (res.status === 200) {
        showSuccess("ทำรายการสำเร็จ", "ทำการอัพเดตมูลสําเร็จ");
        await document.getElementById("my_modal_1").close();
        await fetchData();
      } else {
        showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }
    } catch (error) {
      showError("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  // method
  const handleDeleted = async (id) => {
    try {
      await axios.delete(`/api/subActivity/${id}`);
      showSuccess("ลบสำเร็จ", "ลบกิจกรรมย่อยเรียบร้อยแล้ว");
      fetchData();
    } catch (err) {
      showError("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
    }
  };

  // useEffect
  useEffect(() => {
    if (id) {
      fetchData();
    }
    fetchMain();
    if (selectedIdSub) {
      fetchDataOil();
    }
  }, [selectedIdSub, id]);

  //to
  const openModal = (id) => {
    setSelectedIdSub(id);
    document.getElementById("my_modal_1").showModal();
  };
  const onChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col justify-start md:flex-row gap-10 items-center mb-4">
        <CommonTextHeaderView text="จัดการกิจกรรมย่อย" />
      </div>
      <div className="flex flex-col items-start md:flex-row gap-5 ">
        <div className="w-full h-[50%] border border-gray-200 rounded-xl p-4">
          <h2 className=" border border-gray-200 p-2 rounded-md mb-3 text-center font-bold">
            กิจกรรมหลัก
          </h2>
          {activity && (
            <div className="text-black p-2">
              <p className="mb-2">
                <span className="font-semibold">ชื่อกิจกรรม:</span>{" "}
                {activity.activity_name}
              </p>
              <p className="mb-2">
                <span className="font-semibold">รายละเอียด:</span>{" "}
                {activity.activity_description}
              </p>
              <p className="mb-2">
                <span className="font-semibold">ค่าใช้จ่าย:</span>{" "}
                {activity.activity_price}
              </p>
              <p>
                <span className="font-semibold">กำหนดการกิจกรรม:</span>{" "}
                {dayjs(activity.activity_start).format("DD/MM/YYYY")}
                {` - `}
                {dayjs(activity.activity_end).format("DD/MM/YYYY")}
                <br />
                <span className="font-semibold">ระยะเวลา:</span>{" "}
                {dayjs(activity.activity_end).diff(
                  dayjs(activity.activity_start),
                  "day"
                )}{" "}
                วัน
              </p>
            </div>
          )}
        </div>
        <div className="grid w-full justify-center items-center grid-cols-1 gap-3">
          {!loading ? (
            Array.isArray(subActivity) && subActivity.length > 0 ? (
              subActivity.map((sub, index) => (
                <div key={sub.sub_activity_id}>
                  <div className="p-4 border border-gray-200 rounded-2xl flex flex-col break-all">
                    <div className="border border-gray-200 p-1 rounded-md">
                      <CommonTextHeaderView
                        text={sub.sub_activity_name}
                        dis={true}
                      />
                    </div>
                    <p className="p-1">{sub.sub_activity_description}</p>
                    <div className="flex flex-col md:flex-row gap-2 break-all">
                      {dayjs(sub.sub_activity_start).format(
                        "วันที่ DD เวลา HH:mm"
                      )}
                      <p className="text-red-500"> จนถึง</p>
                      {dayjs(sub.sub_activity_end).format(
                        "วันที่ DD เวลา HH:mm"
                      )}
                    </div>
                    <div className="flex gap-5">
                      <p>จำนวนที่รับ {sub.sub_activity_max}</p>
                      <p>คะแนนที่ได้จากภารกิจ {sub.sub_activity_point} เเต้ม</p>
                    </div>
                    <p>ค่าใช้จ่าย {sub.sub_activity_price} บาท</p>
                    <img src={sub.qr_image_url} alt="" className="w-32" />

                    <div className="flex w-full gap-2 justify-around">
                    <a
                      href={sub.qr_image_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-300 p-1 border w-full text-black rounded-md cursor-pointer text-center"
                    >
                      ดาวน์โหลด QR
                    </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(sub.sub_activity_id);
                        }}
                        className="bg-amber-300 p-1 border w-full text-black rounded-md cursor-pointer"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => {
                          handleDeleted(sub.sub_activity_id);
                        }}
                        className="w-full text-black rounded-xl cursor-pointer"
                      >
                        <Image
                          src="/logosvg/delete-filled-svgrepo-com.svg"
                          alt="delete"
                          width={25}
                          height={25}
                          className="inline-block mr-2"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center  text-gray-600 mt-4">
                <div className="text-sm md:text-md my-2">
                  ไม่มีข้อมูลภารกิจย่อย
                  {"สามารถเพิ่มภารกิจย่อยตามกิจกรรมหลักได้ใน เพจก่อนหน้านี้"}
                </div>
                <button
                  onClick={() => router.back()}
                  className="border-2 border-gray-200 bg-amber-300 p-2 rounded-lg text-black cursor-pointer hover:scale-105 duration-300 transform transition"
                >
                  เพิ่มภารกิจย่อย
                </button>
              </div>
            )
          ) : (
            <span className="loading loading-dots loading-lg"></span>
          )}
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white">
          <div className="flex justify-center items-center mb-6">
            <CommonTextHeaderView text="แก้ไขกิจกรรมย่อย" dis={true} />
          </div>
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-2"
          >
            <label className="w-full max-w-full">
              ชื่อกิจกรรมย่อย
              <input
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
                type="number"
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
                type="number"
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
                type="number"
                placeholder="ราคา"
                className="border border-gray-200 p-1 md:p-2 rounded-lg w-full"
                onChange={onChange}
                value={formData.sub_activity_price}
                name="sub_activity_price"
              />
            </label>

            <button className="btn w-full mt-2" type="submit">
              บันทึก
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

export default page;
