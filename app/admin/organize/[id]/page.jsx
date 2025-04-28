"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { useAlert } from "@/contexts/AlertContext";

function page() {
  const params = useParams();
  const organizeId = Number(params?.id);
  const [submit, setSubmit] = useState(false);
  const { showSuccess, showError } = useAlert();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [formData, setFormData] = useState({
    organize_name: "",
    organize_address: "",
    organize_tel: "",
    organize_email: "",
    organize_description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // fetch data for editing
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (organizeId !== 0) {
        try {
          const response = await axios.get(`/api/organize/${organizeId}`);
          if (response.status === 200) {
            setFormData(response.data);
          }
        } catch (err) {
          console.error("Error fetching activity data:", err);
        }
      }
    };
    fetchData();
  }, [organizeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("formData", formData);

    const organizeData = {
      ...formData,
      organize_name: formData.organize_name,
      organize_address: formData.organize_address,
      organize_tel: formData.organize_tel,
      organize_email: formData.organize_email,
      organize_description: formData.organize_description,
    };

    console.log("organizeData", organizeData);

    try {
      let response;
      if (organizeId === 0) {
        response = await axios.post("/api/organize", organizeData);
        if (response.status) {
          showSuccess("ทำรายการสำเร็จ", "ทำการบันทึกข้อมูลสําเร็จ");
          router.push("/admin/organize");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        clearForm();
      } else {
        response = await axios.put(`/api/organize/${organizeId}`, organizeData);
        if (response.status === 200) {
          showSuccess("ทำรายการสำเร็จ", "ทำการบันทึกข้อมูลสําเร็จ");
          router.push("/admin/organize");
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
      organize_name: "",
      organize_address: "",
      organize_tel: "",
      organize_email: "",
      organize_description: "",
    });
  };

  return (
    <div>
      {organizeId === 0 ? (
        <CommonTextHeaderView text="เพิ่มหน่วยงาน" />
      ) : (
        <CommonTextHeaderView text="แก้ไขหน่วยงาน" />
      )}

      <div className="container mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อบุคคลหรือหน่วยงาน</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="organize_name"
              placeholder="ชื่อบุคคลหรือหน่วยงาน"
              required
              onChange={handleChange}
              value={formData.organize_name}
            />
          </div>
          <div>
            <label className="block mb-1">ที่อยู่</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="organize_address"
              placeholder="ที่อยู่"
              required
              onChange={handleChange}
              value={formData.organize_address}
            />
          </div>

          <div>
            <label className="block mb-1">เบอร์โทรศัพท์</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="tel"
              name="organize_tel"
              placeholder="เบอร์โทรศัพท์"
              required
              pattern="^[0-9]{10}$"
              maxLength={10}
              onChange={handleChange}
              value={formData.organize_tel}
            />
          </div>

          <div>
            <label className="block mb-1">อีเมล</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="email"
              name="organize_email"
              placeholder="อีเมล"
              required
              onChange={handleChange}
              value={formData.organize_email}
            />
          </div>

          <div>
            <label className="block mb-1">รายละเอียดเพิ่มเติม</label>
            <textarea
              className="p-2 border border-gray-300 rounded-lg w-full"
              name="organize_description"
              placeholder="รายละเอียด"
              onChange={handleChange}
              value={formData.organize_description}
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
