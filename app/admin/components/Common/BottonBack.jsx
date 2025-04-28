"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
function ButtonBack() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <button
        onClick={handleBack}
        className=" text-black  rounded cursor-pointer "
      >
        <Image
          src="/logosvg/back-square-svgrepo-com.svg"
          alt="arrow-left"
          width={30}
          height={30}
          className="inline-block mr-2"
        />
      </button>
    </div>
  );
}

export default ButtonBack;
