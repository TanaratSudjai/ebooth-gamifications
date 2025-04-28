import React from "react";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import BottonAddding from "../components/Common/BottonAddding";
import OrganizeData from "../components/Common/Table/OrganizeData";
import RewardData from "../components/Common/Table/RewardData";

function page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <BottonAddding
          text="เพิ่มของรางวัล"
          color="bg-yellow-400"
          part="reward"
        />
        <CommonTextHeaderView text="จัดการของรางวัล" dis={true} />
      </div>
      <RewardData />
    </div>
  )
}

export default page
