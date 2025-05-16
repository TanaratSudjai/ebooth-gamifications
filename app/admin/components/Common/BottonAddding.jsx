"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineAddBox } from "react-icons/md";

function BottonAddding({ text, color, part }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function to(part, id) {
    setLoading(true);
    router.push(`/admin/${part}/${id}`);
  }

  return (
    <div>
      <button
        className={`p-3 ${color} flex gap-1 items-center border-2 border-gray-200 rounded-lg shadow-md transition duration-300 ease-in-out font-medium
          ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:scale-105 cursor-pointer"
          }
        `}
        onClick={() => to(part, 0)}
        disabled={loading}
      >
        <MdOutlineAddBox />
        {loading ? "กำลังไป..." : text}
      </button>
    </div>
  );
}

export default BottonAddding;
