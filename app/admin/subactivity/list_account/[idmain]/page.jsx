"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
function page() {
  const r = useRouter();
  const p = useParams();
  const searchParams = useSearchParams();
  const [member, setMember] = useState([]);
  //   id activity
  const id_act = p?.idmain;
  const bool = searchParams.get("bool");

  const getMemberData = async () => {
    let response;
    if (bool) {
      response = await axios.get(`/api/getMemberByActivityId/${id_act}`);
      if (response.status === 200) {
        setMember(response.data);
      }
    } else {
      response = await axios.get(`/api/getMemberBySubActivityId/${id_act}`);
      if (response.status === 200) {
        setMember(response.data);
      }
    }
  };

  useEffect(() => {
    getMemberData();
  }, [id_act, bool]);

  return (
    <div>
      {bool === "true" ? (
        <div>
          <h1>List Account Main</h1>
          {"ID Main: " + id_act}
        </div>
      ) : (
        <div>
          <h1>List Account Sub</h1>
          {"ID Main: " + id_act}
        </div>
      )}
    </div>
  );
}

export default page;
