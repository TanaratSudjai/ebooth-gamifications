"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../../../../contexts/CartContext";
import { useRouter } from "next/navigation";
import { BiSolidSelectMultiple } from "react-icons/bi";
export default function CartCountBadge() {
  const { cart } = useCart();
  const totalItems = cart.length;
  const r = useRouter();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // รันแค่ตอน client
    setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  }, []);

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;
    newX = Math.max(0, Math.min(window.innerWidth - 60, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 60, newY));
    setPosition({ x: newX, y: newY });
  };

  const onPointerUp = (e) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (totalItems === 0) return null;

  return (
    <div
      onClick={() => {
        r.push("/member/cart");
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ left: position.x, top: position.y }}
      className="fixed z-50 bg-[#FF6F00] border-2 border-white text-white p-3 rounded-full shadow-xl cursor-grab select-none"
    >
      <BiSolidSelectMultiple />

      <span className="absolute -top-2 -right-2 bg-red-500 text-white shadow-xl border-2 border-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {totalItems}
      </span>
    </div>
  );
}
