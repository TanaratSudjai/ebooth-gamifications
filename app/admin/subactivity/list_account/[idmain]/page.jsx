"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
function page() {
  const r = useRouter();
  const p = useParams();

  const idmain = p?.idmain;

  return <div>{idmain}</div>;
}

export default page;
