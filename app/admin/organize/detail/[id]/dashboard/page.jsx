"use client";
import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import Organize from "@/app/admin/components/Common/Dashboard/Organize";
function page() {
  const r = useRouter();
  const p = useParams();
  const s = useSearchParams();

  const organize_id = p?.id;
  const avtivity_id = s.get("activity_id");
  const organize_name = s.get("organize_name");
  //   console.log("organize_id : ", organize_id);
  //   console.log("avtivity_id : ", avtivity_id);
  //   console.log("organize_name : ", organize_name);

  return (
    <div>
      <CommonTextHeaderView
        text="หน้าแผงควบคุมของหน่วยงาน"
        data={organize_name}
        dis={false}
      />

      <div className="">
        <Organize
          organize_id={organize_id}
          activity_id={avtivity_id}
          organize_name={organize_name}
        />
      </div>
    </div>
  );
}

export default page;
