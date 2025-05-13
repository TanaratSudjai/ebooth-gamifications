"use client";
import React, { useEffect, useState } from "react";
import DataActivity from "../components/Common/Responsive/DataActivity";
function page() {
  const [isMobile, setIsMobile] = useState(true);

  // size moblie logic
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
  }, []);

  return (
    <div>
      <div className="">
        <DataActivity isMobile={isMobile} />
      </div>
    </div>
  );
}

export default page;
