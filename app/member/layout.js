import React from "react";
import Navbar from "./cmponents/common/Navbar";
import Footer from "./cmponents/common/Footer";

export default function MemberLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
    </div>
  );
}
