import React from "react";
import MissionData from "../components/Common/Table/MissionData";
import BottonAddding from "../components/Common/BottonAddding";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";

function page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <BottonAddding text="เพิ่มภารกิจ" color="bg-yellow-400" part="mission" />
        <CommonTextHeaderView text="จัดการเพิ่มภารกิจ" dis={true} />
      </div>
      <MissionData />
    </div>
  );
}

export default page;
