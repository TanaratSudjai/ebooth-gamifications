import React from "react";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import BottonAddding from "../components/Common/BottonAddding";
import OrganizeData from "../components/Common/Table/OrganizeData";
function page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <BottonAddding
          text="เพิ่มหน่วยงาน"
          color="bg-yellow-400"
          part="organize"
        />
        <CommonTextHeaderView text="จัดการหน่วยงาน" dis={true} />
      </div>
      <OrganizeData />
    </div>
  );
}

export default page;
