"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAlert } from "@/contexts/AlertContext";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
function page() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id || 0);

  const [submit, setSubmit] = useState(false);
  const { showError, showSuccess } = useAlert();
  const [missionType, setMissionType] = useState([]);
  const [missionTypeId, setMissionTypeId] = useState(null);

  const [formData, setFormData] = useState({
    mission_name: "",
    mission_detail: "",
    mission_type_id: "",
    mission_points: 1,
    mission_active: true,
    mission_target_count: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const fetchDataMissionType = async () => {
    try {
      const response = await axios.get(`/api/missionType`);
      setMissionType(response.data.data.data);
      // console.log(response.data.data.data);
    } catch (err) {
      console.error("Error fetching activity data:", err);
    }
  };
  const fetchMissionById = async () => {
    if (id !== 0) {
      try {
        const response = await axios.get(`/api/mission/${id}`);
        // console.log(response.data.data[0]);
        setFormData(response.data.data[0]);
      } catch (err) {
        console.error("Error fetching mission data:", err);
      }
    }
  };

  useEffect(() => {
    fetchDataMissionType();
    fetchMissionById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const payload = {
      mission_name: String(formData.mission_name),
      mission_detail: String(formData.mission_detail),
      mission_type_id: Number(formData.mission_type_id),
      mission_points: Number(formData.mission_points),
      mission_active: Boolean(formData.mission_active),
      mission_target_count: Number(formData.mission_target_count),
    };

    try {
      let response;
      if (id === 0) {
        response = await axios.post("/api/mission", payload);
        if (response.status === 201) {
          showSuccess("ทำรายการสำเร็จ", "สร้างภารกิจสำเร็จ");
          clearForm();
        } else {
          showError("เกิดข้อผิดพลาด", "บันทึกข้อมูลไม่สำเร็จ");
        }
      } else {
        response = await axios.put(`/api/mission/${id}`, payload);
        if (response.status === 200) {
          showSuccess("ทำรายการสำเร็จ", "แก้ไขภารกิจสำเร็จ");
        } else {
          showError("เกิดข้อผิดพลาด", "บันทึกข้อมูลไม่สำเร็จ");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      showError("ข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้");
    } finally {
      setSubmit(false);
    }
  };

  const clearForm = () => {
    setFormData({
      mission_name: "",
      mission_detail: "",
      mission_type_id: null,
      mission_points: 0,
      mission_active: true,
      mission_target_count: 0,
    });
  };

  return (
    <div>
      {id === 0 ? (
        <CommonTextHeaderView text="เพิ่มภารกิจ" />
      ) : (
        <CommonTextHeaderView text="แก้ไขภารกิจ" />
      )}

      <div className="container mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อภารกิจ</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="mission_name"
              placeholder="ชื่อภารกิจ"
              required
              onChange={handleChange}
              value={formData.mission_name}
            />
          </div>
          <div>
            <label className="block mb-1">รายละเอียดภารกิจ</label>
            <textarea
              className="p-2 border border-gray-300 rounded-lg w-full"
              name="mission_detail"
              placeholder="รายละเอียดภารกิจ"
              required
              rows={4}
              onChange={handleChange}
              value={formData.mission_detail}
            />
          </div>

          <div>
            <label className="block mb-1">
              ประเภทภารกิจ
              <select
                className="p-2 border border-gray-300 rounded-lg w-full"
                name="mission_type_id"
                onChange={handleChange}
                value={formData.mission_type_id || ""}
              >
                <option value="">เลือกประเภทภารกิจ</option>
                {missionType.map((type_mission, index) => (
                  <option
                    key={type_mission.mission_type_id}
                    value={Number(type_mission.mission_type_id)}
                  >
                    {type_mission.mission_type_name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block mb-1">คะแนนภารกิจ</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              name="mission_points"
              placeholder="คะแนนภารกิจ"
              required
              min={0}
              onChange={handleChange}
              value={formData.mission_points}
            />
          </div>

          <div>
            <label className="block mb-1">เป้าหมายภารกิจ</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              name="mission_target_count"
              placeholder="เป้าหมายภารกิจ"
              required
              min={0}
              onChange={handleChange}
              value={formData.mission_target_count}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block mb-1">สถานะการใช้งาน</label>
            <input
              type="checkbox"
              name="mission_active"
              checked={formData.mission_active}
              onChange={handleChange}
            />
            <span>{formData.mission_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}</span>
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
