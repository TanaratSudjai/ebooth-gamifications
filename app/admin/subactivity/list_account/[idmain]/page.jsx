"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import ListMember from "@/app/admin/components/Common/Table/ListMember";
import { set } from "zod";
function page() {
  const r = useRouter();
  const p = useParams();
  const searchParams = useSearchParams();
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  //   id activity
  const id_act = p?.idmain;
  const bool = searchParams.get("bool");
  const name = searchParams.get("name");
  console.log(name);

  const getMemberData = async () => {
    let response;
    if (bool === "true") {
      response = await axios.get(
        `/api/personnel/getMemberByActivityId/${id_act}`
      );
      console.log(response.data.data.members);

      if (response.status === 200) {
        setMember(response.data.data.members);
        setLoading(false);
      }
    } else {
      response = await axios.get(
        `/api/personnel/getMemberBySubActivityId/${id_act}`
      );
      console.log(response.data.data.members);
      if (response.status === 200) {
        setMember(response.data.data.members);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getMemberData();
  }, [id_act, bool]);

  return (
    <div>
      <CommonTextHeaderView text={`รายชื่อผู้เข้าร่วมกิจกรรม ${name}`} />
      <div className="">
        <ListMember data={member} loading={loading} />
      </div>
    </div>
  );
}

export default page;
