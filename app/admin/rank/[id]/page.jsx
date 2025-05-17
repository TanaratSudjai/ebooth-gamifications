"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "@/contexts/AlertContext";
import { useParams, useRouter } from "next/navigation";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import Image from "next/image";
function page() {
  const router = useRouter();
  const params = useParams();
  const { showSuccess, showError } = useAlert();
  const id = params?.id;
  const [rank, setRank] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    member_rank_name: "",
    member_rank_base: "" || 0,
    member_rank_logo: "",
    preview: null
  });


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        member_rank_logo: file,
        preview: URL.createObjectURL(file),
      });
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(formData.member_rank_logo.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmit(true);

    const payload = new FormData();
    payload.append("member_rank_name", formData.member_rank_name);
    payload.append("member_rank_base", formData.member_rank_base || 0);
    payload.append("member_rank_logo", formData.member_rank_logo);

    try {
      console.log(formData);

      let response;
      if (id == 0) {
        response = await axios.post("/api/memberRank", payload);
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          showSuccess("ทำรายการสำเร็จ", "สร้างกิจกรรมสําเร็จ");
          router.push("/admin/rank");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        clearForm();
      } else {
        response = await axios.put(`/api/memberRank/${id}`, payload);
        if (response.status === 200 || response.status === 201) {
          showSuccess("ทำรายการสำเร็จ", "สร้างกิจกรรมสําเร็จ");
          router.push("/admin/rank");
        } else {
          showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataEdit = async () => {
    try {
      const response = await axios.get(`/api/memberRank/${id}`);
      setRank(response.data.data);
      console.log("logo is " + response.data.data.member_rank_logo);
      setFormData(response.data.data);
      formData.member_rank_logo = response.data.data.member_rank_logo;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id != 0) {
      fetchDataEdit();
    }
  }, [id]);

  const clearForm = () => {
    setFormData({
      member_rank_name: "",
      member_rank_base: "",
      member_rank_logo: "",
    });
  };
  return (
    <div>
      {id == 0 ? (
        <CommonTextHeaderView text="เพิ่มระดับยศ" />
      ) : (
        <CommonTextHeaderView text="แก้ไขระดับยศ" />
      )}

      <div className="container mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start gap-4"
        >
          <div>
            <label className="block mb-1">ชื่อยศ</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full "
              type="text"
              name="member_rank_name"
              placeholder="ชื่อยศ"
              required
              onChange={handleChange}
              value={formData.member_rank_name}
            />
          </div>
          <div>
            <label className="block mb-1">ค่าเเรงก์พื้นฐาน</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full "
              type="text"
              name="member_rank_base"
              placeholder="ค่าเเรงก์พื้นฐาน"
              required
              onChange={handleChange}
              value={formData.member_rank_base}
            />
          </div>
          <div>
            <label className="block mb-1">สัญลักษณ์</label>
            <input
              className="p-2 border border-gray-300 rounded-lg w-full "
              type="file"
              name="member_rank_logo"
              placeholder="สัญลักษณ์"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="">
            <label className="block mb-1">สัญลักษณ์</label>
            {formData.preview && (
              <img
                src={formData.preview}
                alt="preview"
                className="w-32 h-32 object-cover mt-2 rounded"
              />
            )}
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
