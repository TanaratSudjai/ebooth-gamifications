import React from "react";
import Image from "next/image";
function Navbar() {
  return (
    <div className=" shadow-2xl border-2 m-1 rounded-lg border-gray-200">

      <Image src="/favicon.png" alt="logo" width={65} height={65} className="bg-gray-800 p-1 m-1 rounded-full"/>

    </div>
  );
}

export default Navbar;
