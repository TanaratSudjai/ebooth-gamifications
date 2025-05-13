"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { useAlert } from "@/contexts/AlertContext";
import axios from "axios";
function page() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id)
  const [submit, setSubmit] = useState(false);
  const { showSuccess, showError } = useAlert();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    member_username: "",
    member_email: "",
    member_password: "",
    member_address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    try {
      let response;
      if (id == 0) {
        console.log(formData);
        response = await axios.post("/api/user/profile", formData);
        if (response.status === 201) {
          showSuccess("ทำรายการสำเร็จ", "สร้างสมาชิกสําเร็จ");
          router.push("/admin/member");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        clearForm();
      } else {
        console.log("update", formData);
        response = await axios.put(`/api/user/profile/${id}`, formData);
        if (response.status === 200) {
          showSuccess("ทำรายการสำเร็จ", "แก้ไขสมาชิกสําเร็จ");
          router.push("/admin/member");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      }
    } catch (err) {
      console.error("Error fetching activity data:", err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/user/profile/${id}`);
    

      if (response.status === 200) {
        setFormData(response.data);
      }

    } catch (err) {
      console.error("Error fetching activity data:", err);
    }
  };

  useEffect(() => {
    if (id != 0) {
      fetchData();
    }
  }, []);

  const clearForm = () => {
    setFormData({
      member_username: "",
      member_email: "",
      member_password: "",
      member_address: "",
    });
  };
  return (
    <div>
      {id === 0 ? (
        <CommonTextHeaderView text="เพิ่มสมาชิก" />
      ) : (
        <CommonTextHeaderView text="แก้ไขสมาชิก" />
      )}

      <div className="container mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อสมาชิก</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="member_username"
              placeholder="ชื่อสมาชิก"
              required
              onChange={handleChange}
              value={formData.member_username}
            />
          </div>
          <div>
            <label className="block mb-1">อีเมลผู้ใช้</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="email"
              name="member_email"
              placeholder="อีเมลผู้ใช้"
              required
              onChange={handleChange}
              value={formData.member_email}
            />
          </div>

          <div>
            <label className="block mb-1">
              รหัสผ่าน (ระบบจะทำการเข้ารหัสหลังจากบันทึกไป)
            </label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="tel"
              name="member_password"
              placeholder="รหัสผ่าน (ระบบจะทำการเข้ารหัสหลังจากบันทึกไป)"
              required
              onChange={handleChange}
              value={formData.member_password}
            />
          </div>

          <div>
            <label className="block mb-1">ที่อยู่สมาชิก</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="member_address"
              placeholder="ที่อยู่"
              required
              onChange={handleChange}
              value={formData.member_address}
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
