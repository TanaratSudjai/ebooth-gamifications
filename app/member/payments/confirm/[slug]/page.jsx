"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import QRCode from "qrcode";
import { generatePromptPayPayload } from "@/utils/promptpay";
import Image from "next/image";
import { useCart } from "../../../../../contexts/CartContext";
import axios from "axios";
import { useAlert } from "../../../../../contexts/AlertContext";
function Page() {
  const p = useParams();
  const r = useRouter();
  const price = p?.slug;
  const [qrText, setQrDataUrl] = useState("");
  const { cart } = useCart();
  const { data: session } = useSession();
  const { showWarning, showError, showSuccess } = useAlert();
  async function handleSubmitBooking() {
    const member_id = session?.user?.id;
    const group = {};
    const activity_ids = [];
    const sub_activity_ids = [];

    cart.forEach((item) => {
      if (!item.activity_id || !item.sub_activity_id) return;
      if (!group[item.activity_id]) {
        group[item.activity_id] = [];
      }

      group[item.activity_id].push(item.sub_activity_id);
    });

    const payload = Object.entries(group).map(([activity_id, sub_ids]) => ({
      member_id: member_id,
      activity_id: Number(activity_id),
      sub_activity_ids: sub_ids.filter(Boolean),
    }));

    for (const item of payload) {
      activity_ids.push(item.activity_id);
      sub_activity_ids.push(item.sub_activity_ids);
    }

    for (const booking of payload) {
      try {
        const response = await axios.post("/api/checkin", booking);
        showSuccess("จองเรียบร้อย");
        localStorage.setItem("cart", JSON.stringify([]));
        window.location.reload();
        r.push("/member/profile_member");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          showWarning("คุณจองไปแล้ว");
          localStorage.setItem("cart", JSON.stringify([]));
          r.push("/member/profile_member");
        } else {
          console.error("เกิดข้อผิดพลาด:", err);
          showWarning("ไม่สามารถจองได้");
        }
      }
    }
  }

  // ------------------- QR Code -------------------
  useEffect(() => {
    const payload = generatePromptPayPayload({
      mobileNumber: process.env.NEXT_PUBLIC_PROMPTPAY_NUMBER,
      amount: Number(price).toFixed(2),
    });
    QRCode.toDataURL(payload, { width: 300 }, (err, url) => {
      if (!err) {
        setQrDataUrl(url);
      }
    });
  }, [price]);

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="flex flex-col items-center justify-center bg-white">
        <h4 className="font-semibold  text-gray-800">
          QR สำหรับยอดเงิน: {price} บาท
        </h4>
        <div className="bg-white rounded">
          {qrText ? (
            <Image src={qrText} alt="QR Code" width={300} height={300} />
          ) : (
            <p>Loading QR code...</p>
          )}
        </div>
        <a
          href={qrText}
          download={`qr-${price}.png`}
          className="inline-block  text-black px-4 py-2 rounded-full border-dashed border-2  transition"
        >
          ดาวน์โหลด QR Code
        </a>
      </div>
      <div
        onClick={() => handleSubmitBooking()}
        className="bg-[#FF6F00] text-center hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-200 mt-4"
      >
        ยืนยันการชำระเงิน
      </div>
    </div>
  );
}

export default Page;
