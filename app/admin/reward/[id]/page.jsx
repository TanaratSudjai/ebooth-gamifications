"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { useAlert } from "@/contexts/AlertContext";

function page() {
  const params = useParams();
  const rewardId = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submit, setSubmit] = useState(false);
  const { showSuccess, showError } = useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState({
    reward_name: "",
    reward_point_required: "",
    reward_qty_available: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (rewardId !== 0) {
        try {
          const response = await axios.get(`/api/reward/${rewardId}`);
          if (response.status === 200) {
            setFormData(response.data);
          }
        } catch (err) {
          console.error("Error fetching activity data:", err);
        }
      }
    };
    fetchData();
  }, [rewardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("formData", formData);

    const rewardData = {
      ...formData,
      reward_name: formData.reward_name,
      reward_point_required: parseInt(formData.reward_point_required) ,
      reward_qty_available: parseInt(formData.reward_qty_available) ,
    };

    console.log("rewardData", rewardData);

    try {
      let response;
      if (rewardId === 0) {
        response = await axios.post("/api/reward", rewardData);
        if (response.status) {
          showSuccess("ทำรายการสำเร็จ", "ทำการบันทึกข้อมูลสําเร็จ");
          router.push("/admin/reward");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        clearForm();
      } else {
        response = await axios.put(`/api/reward/${rewardId}`, rewardData);
        if (response.status === 200 || response.status === 201) {
          showSuccess("ทำรายการสำเร็จ", "ทำการบันทึกข้อมูลสําเร็จ");
          router.push("/admin/reward");
        } else {
          showError("Error create", "Something went wrong.");
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
        reward_name: "",
        reward_point_required: "",
        reward_qty_available: "",
    });
  };

  return (
    <div>
      {rewardId === 0 ? (
        <CommonTextHeaderView text="เพิ่มของรางวัล" />
      ) : (
        <CommonTextHeaderView text="แก้ไขของรางวัล" />
      )}

      <div className="container mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อของรางวัล</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="reward_name"
              placeholder="ชื่อของรางวัล"
              required
              onChange={handleChange}
              value={formData.reward_name}
            />
          </div>
          <div>
            <label className="block mb-1">คะแนนที่ใช้แลก</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              name="reward_point_required"
              placeholder="คะแนนที่ใช้แลก"
              required
              onChange={handleChange}
              value={formData.reward_point_required}
            />
          </div>
          <div>
            <label className="block mb-1">จำนวนของรางวัล</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="number"
              name="reward_qty_available"
              placeholder="จำนวนของรางวัล"
              required
              onChange={handleChange}
              value={formData.reward_qty_available}
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
