"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MdOutlineAddBox } from "react-icons/md";
function BottonAddding({ text, color, part }) {
  const router = useRouter();

  async function to(part, id) {
    router.push(`/admin/${part}/${id}`);
  }

  return (
    <div>
      <button
        className={`p-3 ${color} flex gap-1 items-center border-2 border-gray-200 cursor-pointer hover:scale-105 transform rounded-lg shadow-md transition duration-300 ease-in-out text-black font-medium`}
        onClick={() => to(part, 0)}
      >
        <MdOutlineAddBox />
        {text}
      </button>
    </div>
  );
}

export default BottonAddding;
