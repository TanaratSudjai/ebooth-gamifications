"use client";
import React from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
function ButtonBack() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <button
        onClick={handleBack}
        className=" text-blue-400  rounded cursor-pointer "
      >
        <IoArrowBackCircle size={30} />
      </button>
    </div>
  );
}

export default ButtonBack;
