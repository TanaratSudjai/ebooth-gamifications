"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MemberOfActivity from "@/app/admin/components/Common/Table/MemberOfActivity";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import axios from "axios";
function page() {
  const p = useParams();
  const id_main = Number(p.id_main);
  const [main, setNameMain] = useState("");

  const fetchData = async () => {
    try {
      if (id_main !== 0) {
        const response = await axios.get(`/api/activity/${id_main}`);
        setNameMain(response.data.activity_name);
        console.log(
          "🚀 ~ file: page.jsx:12 ~ fetchData ~ response.data:",
          response.data
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id_main && id_main !== 0) {
      fetchData();
    }
  }, [id_main]);

  return (
    <div>
      <CommonTextHeaderView text={"รายชื่อสมาชิก"} data={main} />
      <div className="container mt-5">
        <MemberOfActivity id_main={id_main} />
      </div>
    </div>
  );
}

export default page;
