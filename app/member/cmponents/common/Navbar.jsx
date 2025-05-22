import React from "react";
import Image from "next/image";
function Navbar() {
  return (
    <div className="bg-gray-800 border-b border-gray-200">
      <Image src="/favicon.png" alt="logo" width={65} height={65} />
    </div>
  );
}

export default Navbar;
