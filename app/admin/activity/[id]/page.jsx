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
  const [mission, setMission] = useState([]);
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
    organize_id: 0,
    activity_price: 0,
    mission_ids: [],
  });

  // use sweetalert2 for error and success message
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue =
      type === "number" || name === "mission_ids" ? Number(value) : value;

    if (name === "mission_ids") {
      setFormData((prev) => {
        const currentMissions = prev.mission_ids || [];
        return {
          ...prev,
          mission_ids: checked
            ? [...currentMissions, parsedValue]
            : currentMissions.filter((id) => id !== parsedValue),
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const fetchOrganize = async () => {
    try {
      const response = await axios.get("/api/organize");
      if (response.status === 200) {
        setOrganize(response.data.data);
      }
      // console.log(response.data.data);
    } catch (err) {
      console.error("Error fetching organize data:", err);
    }
  };

  const fetchData = async () => {
    if (activityId !== 0) {
      try {
        const response = await axios.get(`/api/activity/${activityId}`);
        if (response.status === 200) {
          const data = response.data;

          // ตรวจสอบว่า mission_ids เป็น string หรือ array แล้วแปลงเป็น number[]
          const missionIds =
            typeof data.mission_ids === "string"
              ? data.mission_ids.split(",").map((id) => Number(id))
              : Array.isArray(data.mission_ids)
              ? data.mission_ids.map((id) => Number(id))
              : [];

          setFormData({
            ...data,
            mission_ids: missionIds,
          });
        }
      } catch (err) {
        console.error("Error fetching activity data:", err);
      }
    }
  };

  const fecthMission = async () => {
    try {
      const response = await axios.get(`/api/mission`);
      setMission(response.data.data.data);
    } catch (err) {
      console.error("Error fetching activity data:", err);
    }
  };

  // fetch data for editing
  useEffect(() => {
    fetchOrganize();
    fetchData();
    fecthMission();
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
      mission_ids: Array.isArray(formData.mission_ids)
        ? formData.mission_ids.map((id) => parseInt(id))
        : [],
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
      mission_ids: [],
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
            <textarea
              rows={4}
              className="p-2 border border-gray-300 rounded-lg w-full "
              type="area"
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
                showTimeInput
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
                timeInputLabel="Time:"
                showTimeInput
                wrapperClassName="w-full"
                dateFormat="MM/dd/yyyy h:mm aa"
                className="text-black p-2 border border-gray-300 rounded-lg w-full"
                required
                placeholderText="กรูณาเลือกวันจบกิจกรรม"
              />
            </div>
          </div>

          <div className="flex w-full gap-2 flex-col md:flex-row">
            <div className="flex w-full  gap-2 justify-center items-center">
              <div className="basis-1/2">
                <label className="block mb-1">จำนวนผู้เข้าร่วมสูงสุด</label>
                <input
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  type="number"
                  name="activity_max"
                  placeholder="จำนวนผู้เข้าร่วมสูงสุด"
                  required
                  onChange={handleChange}
                  value={formData.activity_max}
                />
              </div>
              <div className="basis-1/2">
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
            </div>
            <div className="flex  w-full  gap-2 justify-center items-center">
              <div className="basis-1/2">
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
              <div className="basis-1/2">
                <label className="block mb-1">ผู้จัดกิจกรรม</label>
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
            </div>
          </div>

          {/* map mission */}
          <label>เลือกเกมส์ในกิจกรรม</label>
          <div className="flex gap-2 flex-wrap">
            {mission.map((missionItem) => {
              const isChecked = formData.mission_ids.includes(
                Number(missionItem.mission_id)
              );

              return (
                <label
                  key={missionItem.mission_id}
                  className={`flex items-center p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isChecked
                      ? "bg-yellow-100 border-yellow-500 shadow-md"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="mission_ids"
                    value={missionItem.mission_id}
                    onChange={handleChange}
                    checked={isChecked}
                    className="hidden"
                  />
                  <span className="ml-2">{missionItem.mission_name}</span>
                </label>
              );
            })}
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
