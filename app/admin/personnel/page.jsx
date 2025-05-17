"use client";
import React, { useState } from "react";
import Adding from "../components/Common/BottonAddding";
import PersonnelData from "../components/Common/Table/PersonnelData";
import CommonTextHeaderView from "../components/Common/TextHeader/View";

function page() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <Adding text="เพิ่มบุคลากร" color="bg-yellow-400" part="personnel" />
        <CommonTextHeaderView text="หน้าจัดการบุคลากร" dis={true} />
        <input
          onChange={handleSearch}
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2"
          placeholder="ค้นหารายชื่อบุคลากร"
        />
      </div>
      <PersonnelData search={search} />
    </div>
  );
}

export default page;
