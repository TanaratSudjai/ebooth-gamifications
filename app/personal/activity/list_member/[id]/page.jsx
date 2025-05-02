"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import ButtonBack from "@/app/personal/components/Common/BottonBack";
import DataListMember from "@/app/personal/components/Common/Responsive/DataListMember";
function page() {
  const { id } = useParams();

  const [isMobile, setIsMobile] = useState(true);
  const [activity, setActivity] = useState(null);

  const fetchData = async () => {
    if (!id) return; // ป้องกัน undefined
    try {
      const res_activity = await axios.get(`/api/activity/${id}`);
      setActivity(res_activity.data.activity_name);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    }
  };

  // size moblie logic
  const handleResize = () => {
    if (window.innerWidth <= 900) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      fetchData();
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  return (
    <div>
      <ButtonBack />
      <div>
        <DataListMember isMobile={isMobile} activity_id={id} />
      </div>
    </div>
  );
}

export default page;
