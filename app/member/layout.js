import React from "react";
import Navbar from "./cmponents/common/Navbar";
import Footer from "./cmponents/common/Footer";
import { AnimatePresence } from "framer-motion";
import { UserDataProvider } from "../../contexts/MemberContext";
// import CommonTextHeaderView from "../admin/components/Common/TextHeader/View";
export default function MemberLayout({ children }) {
  return (
    <UserDataProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <AnimatePresence mode="wait"><main className="flex-1 bg-white p-2">{children}</main></AnimatePresence>
        <Footer />
      </div>
    </UserDataProvider>
  );
}
