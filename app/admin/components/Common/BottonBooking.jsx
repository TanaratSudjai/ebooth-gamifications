"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CalendarSearch } from "lucide-react";
function BottonBooking({ id = "" }) {
  const r = useRouter();
  const key = id;

  const handleBooking = () => {
    r.push(`/admin/booking/${key}`);
  };
  return (
    <div>
      <button onClick={handleBooking} className="btn btn-primary px-10 rounded-lg">
       จอง <CalendarSearch/>
      </button>
    </div>
  );
}

export default BottonBooking;
