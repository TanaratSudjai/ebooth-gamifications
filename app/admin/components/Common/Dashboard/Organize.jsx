"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import Image from "next/image";
import { useRouter } from "next/navigation";
function Organize({ organize_id, activity_id, organize_name }) {
  // state data
  const [organize, setOrganize] = useState([]);
  const [activity, setActivity] = useState([]);
  const [subactivity, setSubactivity] = useState([]);
  const [member, setMember] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filter, setFilter] = useState([]);

  // loading && variable
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  //method
  async function getOrganize(params) {
    if (params !== 0) {
      try {
        const response = await axios.get(`/api/organize/${params}`);
        // console.log(response.data);
        setOrganize(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return;
    }
  }

  async function getActivity(params) {
    if (params !== 0) {
      try {
        const response = await axios.get(`/api/activity/${params}`);
        // console.log(response.data);
        setActivity(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return;
    }
  }

  async function getSubactivity(params) {
    if (params !== 0) {
      try {
        const response = await axios.get(
          `/api/subActivity/getSubByActivity/${params}`
        );
        setSubactivity(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return;
    }
  }

  async function getMember(params) {
    if (params !== 0) {
      try {
        const response = await axios.get(
          `/api/personnel/getMemberByActivityId/${params}`
        );
        setMember(response.data.data.members);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return;
    }
  }

  // function
  const listMember = async (id, bool, name) => {
    // console.log("listMember", id);
    router.push(
      `/admin/subactivity/list_account/${id}?bool=${bool}&name=${name}`
    );
  };

  // useEffect
  useEffect(() => {
    getOrganize(organize_id);
    getActivity(activity_id);
    getSubactivity(activity_id);
    getMember(activity_id);

    if (!Array.isArray(member)) return;

    const filtered = member.filter((item) => {
      const name = item.member_name || "";
      return name.toLowerCase().includes(searchName.toLowerCase());
    });

    setFilter(filtered);
  }, [organize_id, activity_id, searchName, member]);

  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex gap-2 items-stretch w-full  flex-col lg:flex-row mt-5">
          {/* Organize */}
          <div className="bg-white shadow-md  p-2 w-full rounded-md flex flex-col gap-2 flex-1">
            <div className="p-2 bg-gray-100 border-1 border-gray-200 shadow-md rounded-lg">
              <CommonTextHeaderView
                text="หน่วยงาน"
                data={organize.organize_name}
                dis={true}
              />
            </div>
            <div className="bg-white w-full px-2 rounded-lg flex flex-col gap-2">
              <span className="flex gap-2">
                <b className="w-24">คําอธิบาย</b>
                <span>{organize.organize_description}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">ที่อยู่</b>
                <span>{organize.organize_address}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">เบอร์โทร</b>
                <span>{organize.organize_tel}</span>
              </span>
            </div>
          </div>
          {/* Activity */}
          <div className="bg-white shadow-md  p-2 w-full rounded-md flex flex-col gap-2 flex-1">
            <div className="p-2 bg-gray-100 border-1 border-gray-200 shadow-md rounded-lg">
              <CommonTextHeaderView
                text="กิจกรรม"
                data={activity.activity_name}
                dis={true}
              />
            </div>
            <div className="bg-white w-full px-2 rounded-lg flex flex-col gap-2">
              <span className="flex gap-2">
                <b className="w-24">คําอธิบาย</b>
                <span>{activity.activity_description}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">วันที่เริ่ม</b>
                <span>{activity.activity_start}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">วันที่สิ้นสุด</b>
                <span>{activity.activity_end}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">ราคากิจกรรม</b>
                <span>{activity.activity_price}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">จํานวนแต้ม</b>
                <span>{activity.reward_points}</span>
              </span>
              <span className="flex gap-2">
                <b className="w-24">จำนวนที่รับ</b>
                <span>{activity.activity_max}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white  p-2 w-full flex gap-2 justify-center items-stretch  flex-col lg:flex-row mt-5">
        {/* Subactivity */}
        <div className="p-2 bg-white shadow-md rounded-lg flex-1 h">
          <CommonTextHeaderView text="กิจกรรมย่อย" dis={true} />
          <div className="flex flex-col gap-1 mt-2 overflow-y-scroll h-[500px] md:h-[600px] lg:h-[1000px]">
            {subactivity.map((subActivity, index) => (
              <div
                key={index + 1}
                className="flex flex-col gap-2 p-2 shadow-sm  rounded-lg"
              >
                <span className="bg-gray-100 border-1 border-gray-200 shadow-md p-1 rounded-lg">
                  {subActivity.sub_activity_name}
                </span>
                <div className="px-3">
                  <span className="flex gap-2">
                    <b className="w-24">คําอธิบาย</b>
                    <span>{subActivity.sub_activity_description}</span>
                  </span>
                  <span className="flex gap-2">
                    <b className="w-24">วันที่เริ่ม</b>
                    <span>{subActivity.sub_activity_start}</span>
                  </span>
                  <span className="flex gap-2">
                    <b className="w-24">วันที่สิ้นสุด</b>
                    <span>{subActivity.sub_activity_end}</span>
                  </span>
                  <span className="flex gap-2">
                    <b className="w-24">
                      QR code <br />
                      <a
                        href={subActivity.qr_image_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-300 text-sm px-2 border-none shadow-md w-full text-black rounded-md cursor-pointer text-center"
                      >
                        ดาวน์โหลด
                      </a>
                    </b>
                    <span>
                      <Image
                        src={subActivity.qr_image_url}
                        alt="qr"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    </span>
                  </span>
                  <span className="flex gap-2">
                    <b
                      onClick={() => {
                        listMember(
                          subActivity.sub_activity_id,
                          false,
                          subActivity.sub_activity_name
                        );
                      }}
                      className="bg-gray-200 px-1 hover:bg-gray-400 hover:text-white hover:cursor-pointer transform transition duration-300 hover:scale-105 rounded-md"
                    >
                      รายชื่อ
                    </b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Member and Menu */}
        <div className="p-2 bg-white shadow-md rounded-lg flex-1">
          {/* menu */}
          <div className="bg-gray-100 border-1 border-gray-200 p-2 flex-1 justify-around gap-1 rounded-xl">
            <input
              onChange={(e) => setSearchName(e.target.value)}
              type="text"
              className="input input-bordered rounded-lg bg-white text-black"
              placeholder="ค้นหาด้วยชื่อ"
            />
          </div>
          {/* table member */}
          <div className="flex flex-col gap-2 mt-2">
            <CommonTextHeaderView
              text="รายชื่อผู้ลงทะเบียนกิจกรรม"
              dis={true}
            />
            <div className="overflow-x-auto rounded-lg shadow-sm mt-4">
              <table className="min-w-full table-auto text-left ">
                <thead className="bg-gray-100 border-1 border-gray-200 text-gray-800 text-left">
                  <tr>
                    <th className="px-4 py-2 ">ชื่อ</th>
                    <th className="px-4 py-2 ">ที่อยู่</th>
                    <th className="px-4 py-2 ">คะแนน</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filter) &&
                    filter.map((m) => (
                      <tr
                        key={m.member_id}
                        className="hover:bg-gray-100 text-left"
                      >
                        <td className="px-4 py-2">{m.member_username}</td>
                        <td className="px-4 py-2">
                          <Image
                            src={m.member_rank_logo}
                            alt="member"
                            width={40}
                            height={40}
                            unoptimized
                          />
                        </td>
                        <td className="px-4 py-2">{m.member_exp}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organize;
