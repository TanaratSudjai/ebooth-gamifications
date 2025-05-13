"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DataListSub from "@/app/personal/components/Common/Responsive/DataListSub";
function page() {
  const params = useParams();
  const r = useRouter();
  const member_id = params?.member_id ?? "";
  const activity_id = params?.mainactivity_id ?? "";
  
  const [isMobile, setIsMobile] = useState(true);

  const handleResize = () => {
    if (window.innerWidth <= 900) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div>
      <DataListSub
        isMobile={isMobile}
        member_id={member_id}
        activity_id={activity_id}
      />
    </div>
  );
}

export default page;
