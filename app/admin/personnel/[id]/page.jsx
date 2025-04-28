"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { useAlert } from "@/contexts/AlertContext";
function page() {
  const params = useParams();
  const personnelId = Number(params?.id);
  const [organize, setOrganize] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submit, setSubmit] = useState(false);
  const { showSuccess, showError } = useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState({
    personnel_name: "",
    personnel_address: "",
    personnel_tel: "",
    personnel_email: "",
    personnel_description: "",
    personnel_username: "",
    personnel_password: "",
    organize_id: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const fetchOrganize = async () => {
    try {
      const response = await axios.get("/api/organize");
      if (response.status === 200) {
        setOrganize(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching organize data:", err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (personnelId !== 0) {
        try {
          const response = await axios.get(`/api/personnel/${personnelId}`);

          if (response.status === 200) {
            setFormData(response.data);
          }
          setLoading(true)
        } catch (err) {
          console.error("Error fetching activity data:", err);
        }
      }
    };
    fetchOrganize();
    fetchData();
  }, [personnelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("formData", formData);

    const personnelData = {
      ...formData,
      personnel_name: formData.personnel_name,
      personnel_address: formData.personnel_address,
      personnel_tel: formData.personnel_tel,
      personnel_email: formData.personnel_email,
      personnel_description: formData.personnel_description,
      personnel_username: formData.personnel_username,
      personnel_password: formData.personnel_password,
      organize_id: parseInt(formData.organize_id),
    };

    try {
      let response;
      if (personnelId === 0) {
        response = await axios.post("/api/personnel", personnelData);
        if (response.status === 201) {
          showSuccess("ทำรายการสำเร็จ", "ทำการบันทึกข้อมูลสําเร็จ");
          router.push("/admin/personnel");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        clearForm();
      } else {
        response = await axios.put(
          `/api/personnel/${personnelId}`,
          personnelData
        );
        if (response.status === 200) {
          showSuccess("ทำรายการสำเร็จ", "ทำการบันทึกข้อมูลสําเร็จ");
          router.push("/admin/personnel");
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
      personnel_name: "",
      personnel_address: "",
      personnel_tel: "",
      personnel_email: "",
      personnel_description: "",
      personnel_username: "",
      personnel_password: "",
      organize_id: 0,
    });
  };

  return (
    <div>
      {personnelId === 0 ? (
        <CommonTextHeaderView text="เพิ่มบุคลากร" />
      ) : (
        <CommonTextHeaderView text="แก้ไขบุคลากร" />
      )}

      <div className="container mx-auto mt-4">

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อบุคลากร</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="personnel_name"
              placeholder="ชื่อบุคลากร"
              required
              onChange={handleChange}
              value={formData.personnel_name}
            />
          </div>
          <div>
            <label className="block mb-1">ที่อยู่</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="personnel_address"
              placeholder="คำอธิบายกิจกรรม"
              required
              onChange={handleChange}
              value={formData.personnel_address}
            />
          </div>

          <div>
            <label className="block mb-1">เบอร์โทรศัพท์</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="tel"
              name="personnel_tel"
              required
              placeholder="เบอร์โทรศัพท์"
              regex="[0-9]{10}"
              pattern="^[0-9]{10}$"
              maxLength={10}
              onChange={handleChange}
              value={formData.personnel_tel}
            />
          </div>

          <div>
            <label className="block mb-1">รายละเอียดบุคลากร</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="personnel_description"
              placeholder="รายละเอียดบุคลากร"
              required
              onChange={handleChange}
              value={formData.personnel_description}
            />
          </div>

          <div>
            <label className="block mb-1">ชื่อผู้ใช้</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="personnel_username"
              placeholder="ชื่อผู้ใช้"
              required
              onChange={handleChange}
              value={formData.personnel_username}
            />
          </div>
          <div>
            <label className="block mb-1">อีเมล</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full"
              type="text"
              name="personnel_email"
              placeholder="ชื่อผู้ใช้"
              required
              onChange={handleChange}
              value={formData.personnel_email}
            />
          </div>
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
          {personnelId === 0 && (
            <div>
              <label className="block mb-1">รหัสผ่าน</label>
              <input
                className={`p-2 border border-gray-300 rounded-lg w-full`}
                type="text"
                name="personnel_password"
                placeholder="รหัสผ่าน"
                required
                onChange={handleChange}
                value={formData.personnel_password}
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
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
