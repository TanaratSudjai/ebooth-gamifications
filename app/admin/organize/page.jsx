"use client";
import React, { useEffect, useState } from "react";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import BottonAddding from "../components/Common/BottonAddding";
import OrganizeData from "../components/Common/Table/OrganizeData";
import axios from "axios";
function page() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [unitOganize, setUnitOrganize] = useState(0);

  async function fetchData() {
    try {
      const response = await axios.get(
        `/api/organize?page=${page}&limit=${limit}`
      );
      setUnitOrganize(response.data.data.length);
      response.data.data.length;
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <BottonAddding
          text="เพิ่มหน่วยงาน"
          color="bg-yellow-400"
          part="organize"
        />
        <div className="flex gap-10 items-center">
          <CommonTextHeaderView text="จัดการหน่วยงาน" dis={true} />
          <span>จํานวนหน่วยงาน : {unitOganize}</span>
        </div>
      </div>
      <OrganizeData />
    </div>
  );
}

export default page;
