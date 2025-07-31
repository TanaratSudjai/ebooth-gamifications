"use client"
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
function Navbar() {
  const r = useRouter();
  const Notification = () => {
    r.push("/member/notification");
  };
  return (
    <div className=" shadow-2xl border-2 m-1 rounded-lg border-gray-200 flex justify-between items-center">

      <Image src="/favicon.png" alt="logo" width={25} height={25} className="bg-gray-800  rounded-full mx-2" />
      <div onClick={Notification} className="bg-gray-200/50 m-2 rounded-full p-2 h-10 w-10 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 16.5c-.83 0-1.5-.67-1.5-1.5h3c0 .83-.67 1.5-1.5 1.5m5-2.5H7v-1l1-1v-2.61C8 9.27 9.03 7.47 11 7v-.5c0-.57.43-1 1-1s1 .43 1 1V7c1.97.47 3 2.28 3 4.39V14l1 1z" /></svg>      </div>
    </div>
  );
}

export default Navbar;
