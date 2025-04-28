import React from "react";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import CommonTableMemberData from "../components/Common/Table/MemberData";
import BottonAddding from "../components/Common/BottonAddding";
function page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <BottonAddding text="เพิ่มสมาชิก" color="bg-yellow-400" part="member" />
        <CommonTextHeaderView text="จัดการสมาชิก" dis={true} />
      </div>
      <CommonTableMemberData />
    </div>
  );
}

export default page;
