"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import Organize from "../../../components/Common/Detail/Organize";
function page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ?? "";

  return (
    <div>
      <CommonTextHeaderView text="รายละเอียดสมาชิก" dis={false} />
      <div className="container">
        <Organize id={id} />
      </div>
    </div>
  );
}

export default page;
