"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../contexts/CartContext";

function Page() {
  const r = useRouter();
  const { cart, removeFromCart } = useCart();
  const totalItem = cart.length;
  const totalPrice = cart.reduce(
    (total, item) =>
      total + (item.sub_activity_price || item.activity_price || 0),
    0
  );
  return (
    <div>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-4 mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          ยืนยันการจอง
        </h2>
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b py-3"
          >
            <div>
              <p className="text-gray-800 font-medium">
                {item.sub_activity_name || item.activity_name}
              </p>
              <p className="text-sm text-gray-600">
                {item.sub_activity_price || item.activity_price || 0} บาท
              </p>
            </div>
            <button
              onClick={() =>
                 removeFromCart(item.sub_activity_id, item.activity_id)
              }
              className="text-red-500 hover:text-red-600 text-sm"
            >
              ยกเลิก
            </button>
          </div>
        ))}

        <div className="w-full mt-12 space-y-2">
          <div className="flex">
            <span className="w-36 font-medium text-gray-700">ยอดรวม :</span>
            <span className="text-gray-900">{totalPrice} บาท</span>
          </div>
          <div className="flex">
            <span className="w-36 font-medium text-gray-700">
              รายการทั้งหมด :
            </span>
            <span className="text-gray-900">{totalItem} รายการ</span>
          </div>
        </div>
      </div>
      <div
        onClick={() => r.push("/member/payments/confirm/" + totalPrice)}
        className="bg-[#FF6F00] text-center hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors duration-200 mt-4"
      >
        ยืนยัน & จ่ายเงิน
      </div>
    </div>
  );
}

export default Page;
