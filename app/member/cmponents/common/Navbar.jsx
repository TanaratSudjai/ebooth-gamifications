import React from "react";
import Image from "next/image";
function Navbar() {
  return (
    <div className="bg-[#252525] shadow-2xl border-2 m-1 rounded-lg border-gray-200">
      <Image src="/favicon.png" alt="logo" width={65} height={65} />
    </div>
  );
}

export default Navbar;
