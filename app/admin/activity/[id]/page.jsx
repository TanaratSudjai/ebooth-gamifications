"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { useAlert } from "@/contexts/AlertContext";
import {
  toDatetimeLocalString,
  toSQLDatetimeFormat,
} from "@/utils/formatdatelocal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
function page() {
  const params = useParams();
  const activityId = Number(params?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [organize, setOrganize] = useState([]);

  const [submit, setSubmit] = useState(false);
  const { showSuccess, showError } = useAlert();
  const router = useRouter();

  const [formData, setFormData] = useState({
    activity_name: "",
    activity_description: "",
    activity_start: "",
    activity_end: "",
    activity_max: 1,
    reward_points: 1,
    // is_multi_day: false,
    organize_id: 0,
    activity_price: 0,
  });

  // use sweetalert2 for error and success message
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // [name]: type === "checkbox" ? e.target.checked : value,
      [name]: type === "number" ? Number(value) : value,
      // [name]: value
    }));
  };

  const fetchOrganize = async () => {
    try {
      const response = await axios.get("/api/organize");
      if (response.status === 200) {
        setOrganize(response.data.data);
      }
      console.log(response.data.data);
    } catch (err) {
      console.error("Error fetching organize data:", err);
    }
  };
  const fetchData = async () => {
    if (activityId !== 0) {
      try {
        const response = await axios.get(`/api/activity/${activityId}`);
        if (response.status === 200) {
          setFormData(response.data);
          console.log(response.data);
          
        }
        // setLoading(true)
      } catch (err) {
        console.error("Error fetching activity data:", err);
      }
    }
  };
  // fetch data for editing
  useEffect(() => {
    fetchOrganize();
    fetchData();
  }, [activityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmit(true);

    const activityData = {
      ...formData,
      activity_max: parseInt(formData.activity_max),
      reward_points: parseInt(formData.reward_points),
      organize_id: parseInt(formData.organize_id),
      activity_price: parseInt(formData.activity_price),
      activity_start: toSQLDatetimeFormat(formData.activity_start),
      activity_end: toSQLDatetimeFormat(formData.activity_end),
    };

    try {
      let response;
      console.log(activityData);

      if (activityId === 0) {
        response = await axios.post("/api/activity", activityData);
        if (response.status === 201) {
          showSuccess("ทำรายการสำเร็จ", "สร้างกิจกรรมสําเร็จ");
          router.push("/admin/activity");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        clearForm();
      } else {
        response = await axios.put(`/api/activity/${activityId}`, activityData);
        if (response.status === 200) {
          showSuccess("ทำรายการสำเร็จ", "สร้างกิจกรรมสําเร็จ");
          router.push("/admin/activity");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      activity_name: "",
      activity_description: "",
      activity_start: "",
      activity_end: "",
      activity_max: 0,
      reward_points: 0,
      is_multi_day: false,
      organize_id: 0,
      activity_price: 0,
    });
  };

  return (
    <div>
      {activityId === 0 ? (
        <CommonTextHeaderView text="เพิ่มกิจกรรมหลัก" />
      ) : (
        <CommonTextHeaderView text="แก้ไขกิจกรรมหลัก" />
      )}

      <div className="container mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อกิจกรรม</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full "
              type="text"
              name="activity_name"
              placeholder="ชื่อกิจกรรม"
              required
              onChange={handleChange}
              value={formData.activity_name}
            />
          </div>
          <div>
            <label className="block mb-1">คำอธิบาย</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full "
              type="text"
              name="activity_description"
              placeholder="คำอธิบายกิจกรรม"
              required
              onChange={handleChange}
              value={formData.activity_description}
            />
          </div>
          <div className="flex flex-col md:flex-row  w-full gap-2 ">
            <div className="w-full ">
              <label className="block mb-1">วันเริ่มกิจกรรม</label>
              <DatePicker
                selected={
                  formData.activity_start
                    ? new Date(formData.activity_start)
                    : null
                }
                onChange={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    activity_start: date,
                  }));
                }}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                className="text-black p-2 border border-gray-300 rounded-lg w-full "
                required
                wrapperClassName="w-full"
                placeholderText="กรูณาเลือกวันเริ่มกิจกรรม"
              />
            </div>
            <div className="w-full ">
              <label className="block mb-1">วันจบกิจกรรม</label>
              <DatePicker
                selected={
                  formData.activity_end ? new Date(formData.activity_end) : null
                }
                onChange={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    activity_end: date,
                  }));
                }}
                wrapperClassName="w-full"
                dateFormat="MM/dd/yyyy h:mm aa"
                className="text-black p-2 border border-gray-300 rounded-lg w-full"
                required
                placeholderText="กรูณาเลือกวันจบกิจกรรม"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">จำนวนผู้เข้าร่วมสูงสุด</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              maxLength={5}
              name="activity_max"
              placeholder="จำนวนผู้เข้าร่วมสูงสุด"
              required
              onChange={handleChange}
              value={formData.activity_max}
            />
          </div>
          <div>
            <label className="block mb-1">คะแนนรางวัล</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              name="reward_points"
              placeholder="คะแนนรางวัล"
              required
              onChange={handleChange}
              value={formData.reward_points}
              min="0"
            />
          </div>

          {/* <div className="flex items-center gap-2">
            <input
              className="p-2 w-auto border border-gray-300 rounded-lg"
              type="checkbox"
              name="is_multi_day"
              value={1}
              onChange={handleChange}
              checked={formData.is_multi_day}
              id="is_multi_day"
            />
            <label htmlFor="is_multi_day">กิจกรรมหลายวัน</label>
          </div> */}

          <div>
            <label className="block mb-1">ผู้จัดกิจกรรม</label>
            {/* dropdown organizer with ul li  */}
            <select
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              name="organize_id"
              required
              onChange={handleChange}
              value={formData.organize_id}
            >
              <option value="">เลือกผู้จัดกิจกรรม</option>
              {Array.isArray(organize) &&
                organize.map((org) => (
                  <option key={org.organize_id} value={org.organize_id}>
                    {org.organize_name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">ราคากิจกรรม</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              name="activity_price"
              placeholder="ราคากิจกรรม"
              required
              onChange={handleChange}
              value={formData.activity_price}
              min="0"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={submit}
              className="bg-yellow-500 hover:scale-105 transform  transition duration-300 ease-in-out  text-black font-bold cursor-pointer p-3 rounded-lg "
              type="submit"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default page;
