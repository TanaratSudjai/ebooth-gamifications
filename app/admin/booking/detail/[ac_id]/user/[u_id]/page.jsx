"use client";
import React, { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAlert } from "@/contexts/AlertContext";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import CardActivity from "@/app/admin/components/Common/Card/Activity";
import dayjs from "dayjs";
import { TiShoppingCart } from "react-icons/ti";
import { array } from "zod";
import QRCode from "qrcode";
import { generatePromptPayPayload } from "@/utils/promptpay";
import { useMemo } from "react";
function page() {
  // lazy loading
  const params = useParams();
  const router = useRouter();
  const activity_id = params?.ac_id;
  const user_id = params?.u_id;
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useAlert();

  //state
  const [activity, setActivity] = useState(null);
  const [subactivity, setSubActivity] = useState(null);
  const [subActivityId, setSubActivityId] = useState([]);
  const [payment, setPayment] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const totalPrice = useMemo(() => {
    if (!activity || !subactivity) return 0;
    return (
      Number(activity.activity_price) +
      subActivityId.reduce((total, id) => {
        const selected = subactivity.find(
          (item) => item.sub_activity_id.toString() === id
        );
        return total + (selected ? Number(selected.sub_activity_price) : 0);
      }, 0)
    );
  }, [activity, subactivity, subActivityId]);

  console.log(totalPrice);

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      // กรณีเช็ค => เพิ่มค่าเข้าไป
      setSubActivityId((prev) => [...prev, value]);
    } else {
      // กรณียกเลิกเช็ค => เอาค่าออก
      setSubActivityId((prev) => prev.filter((id) => id !== value));
    }
  };

  // method
  const fetchData = async () => {
    try {
      setLoading(true);
      const response_subactivity = await axios.get(
        `/api/subActivity/getSubByActivity/${activity_id}`
      );
      const response_activity = await axios.get(`/api/activity/${activity_id}`);
      setActivity(response_activity.data || {});
      setSubActivity(response_subactivity.data.data || []);
      console.log(response_subactivity.data.data);
      console.log(response_activity.data);
    } catch (err) {
      showError(err);
    }
  };

  const handlePayment = async () => {
    try {
      const payload = {
        activity_id: Number(activity_id),
        member_id: Number(user_id),
        sub_activity_ids: subActivityId.map(Number),
      };
      const response = await axios.post("/api/checkin", payload);
      const { status } = await response.data.status;
      console.log("สถานะการเช็ค ", status);
      if (status === 400) {
        showWarning("ไม่สามารถเช็คอินได้", "คุณได้ทำรายการไปแล้ว");
        return;
      }
      showSuccess("สำเร็จ", "สั่งซื้อสำเร็จ");
      document.getElementById("my_modal_1")?.showModal(); // เช็คว่ามี modal จริงหรือไม่ก่อนเรียก
    } catch (err) {
      const message =
        err?.response?.data?.message || "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
      showError(message);
      console.error("Check-in error:", err); // สำหรับ debug
    }
  };

  const generateQRCode = async () => {
    const payload = generatePromptPayPayload({
      mobileNumber: process.env.NEXT_PUBLIC_PROMPTPAY_NUMBER,
      amount: Number(totalPrice).toFixed(2),
    });
    QRCode.toDataURL(payload, { width: 300 }, (err, url) => {
      if (!err) {
        setQrDataUrl(url);
      }
    });
  };

  useEffect(() => {
    setPayment(totalPrice);
    generateQRCode();

    if (activity_id && user_id) {
      fetchData();
    }
  }, [activity_id, user_id, totalPrice]);

  return (
    <div>
      {" "}
      <CommonTextHeaderView text="รายละเอียดการจอง" dis={false} />
      <div className="container mx-auto p-5 min-h-screen">
        {activity && (
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:flex-row">
              <div className="item w-full">
                <CardActivity
                  activity_id={activity.activity_id}
                  activity_name={activity.activity_name}
                  activity_description={activity.activity_description}
                  activity_start={activity.activity_start}
                  activity_end={activity.activity_end}
                  activity_max={activity.activity_max}
                  reward_points={activity.reward_points}
                  organize_id={activity.organize_id}
                  activity_price={activity.activity_price}
                  sub_activity_count={activity.sub_activity_count}
                />
                <div className="mt-5">
                  {subactivity && (
                    <div className="grid grid-cols-1  gap-3">
                      {subactivity.map((item) => (
                        <label
                          key={item.sub_activity_id}
                          className="flex items-start space-x-3 p-4  rounded-lg shadow-md border-2 border-gray-100 bg-gray-50 cursor-pointer hover:bg-blue-50 transition"
                        >
                          <input
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            value={item.sub_activity_id.toString()}
                            disabled={item.sub_activity_max === 0}
                            className="peer hidden"
                          />
                          <div className="flex-shrink-0 h-5 w-5 rounded border border-gray-300 bg-white peer-checked:bg-amber-400  mt-1"></div>
                          <div className="text-sm text-gray-800 leading-relaxed">
                            <p className="font-semibold">
                              {item.sub_activity_name}
                            </p>
                            <p className="text-gray-600">
                              {item.sub_activity_description}
                            </p>
                            <p className="text-gray-700">
                              ราคา: {item.sub_activity_price} บาท
                            </p>
                            <p
                              className={`${
                                item.sub_activity_max > 0
                                  ? "text-green-500  bg-green-50 px-2 py-1 rounded"
                                  : "text-red-500  bg-red-50 px-2 py-1 rounded"
                              }`}
                            >
                              {item.sub_activity_max > 0
                                ? `จำนวนสูงสุด: ${item.sub_activity_max} คน`
                                : "จำนวนเข้าร่วมเต็มเเล้ว"}
                            </p>
                            <p className="text-gray-500">
                              เริ่ม:{" "}
                              {dayjs(item.sub_activity_start).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </p>
                            <p className="text-gray-500">
                              สิ้นสุด:{" "}
                              {dayjs(item.sub_activity_end).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="cart-items p-2 shadow-md border-gray-200 border-2 font-light rounded-xl text-gray-600">
                <div className="flex w-full justify-center gap-2 items-center bg-gray-100 border-2 border-gray-500 rounded-lg mb-5 p-2">
                  <TiShoppingCart />
                  กิจกรรมย่อยที่เลือก ราคากิจกรรมหลัก{" "}
                  {Number(activity.activity_price)} บาท
                </div>
                {subActivityId.length > 0 && (
                  <div className="flex justify-between flex-col ">
                    <ul className="list-disc list-inside px-10">
                      {subActivityId.map((id) => {
                        const selected = subactivity.find(
                          (item) => item.sub_activity_id.toString() === id
                        );
                        return (
                          <li key={id} className="list-none mb-2">
                            {selected ? (
                              <div className="flex flex-col gap-3">
                                <div className="flex justify-between bg-white border border-gray-500 rounded-lg p-2 shadow-sm">
                                  <span>{selected.sub_activity_name}</span>
                                  <span>
                                    {selected.sub_activity_price.toLocaleString(
                                      "th-TH"
                                    )}{" "}
                                    บาท
                                  </span>
                                </div>
                              </div>
                            ) : (
                              `ไม่พบชื่อ (ID: ${id})`
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {/* ราคารวมทั้งหมด = กิจกรรมหลัก + กิจกรรมย่อย */}
                  <h3 className="font-semibold mb-2 mt-5 px-10 w-full justify-center flex">
                    ** ราคารวมทั้งหมด {totalPrice.toLocaleString("th-TH")} บาท
                    **
                  </h3>

                  <div className="w-full h-full justify-center flex">
                    <button
                      onClick={() => {
                        handlePayment();
                      }}
                      className="btn bg-gradient-to-r from-amber-300 to-amber-500 border-none  w-auto"
                    >
                      ยืนยันการจองเเละชำระเงิน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center space-y-4">
          <h1 className="text-lg font-bold text-center text-gray-800">
            QR Code จ่ายเงินค่าเข้าร่วมกิจกรรม
          </h1>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="PromptPay QR Code"
              className="w-48 h-48 rounded-md shadow-md border border-gray-300"
            />
          ) : (
            <p className="text-gray-500">กำลังสร้าง QR...</p>
          )}
        </div>
      </dialog>
    </div>
  );
}

export default page;
