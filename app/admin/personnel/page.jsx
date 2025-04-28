import React from "react";
import Adding from "../components/Common/BottonAddding";
import PersonnelData from "../components/Common/Table/PersonnelData";
import CommonTextHeaderView from "../components/Common/TextHeader/View";
function page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <Adding text="เพิ่มบุคลากร" color="bg-yellow-400" part="personnel" />
        <CommonTextHeaderView text="หน้าจัดการบุคลากร" dis={true} />
      </div>
      <PersonnelData />
    </div>
  );
}

export default page;
