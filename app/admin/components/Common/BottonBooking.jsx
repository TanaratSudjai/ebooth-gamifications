"use client";
import React from "react";
import { useRouter } from "next/navigation";
function BottonBooking({ id = "" }) {
  const r = useRouter();
  const key = id;

  const handleBooking = () => {
    r.push(`/admin/booking/${key}`);
  };
  return (
    <div>
      <button onClick={handleBooking} className="btn btn-primary px-10 rounded-lg">
        จอง
      </button>
    </div>
  );
}

export default BottonBooking;
