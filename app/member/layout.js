import React from "react";
import Navbar from "./cmponents/common/Navbar";
import Footer from "./cmponents/common/Footer";
import { AnimatePresence } from "framer-motion";
import { UserDataProvider } from "../../contexts/MemberContext";
import { CartProvider } from "@/contexts/CartContext";
import CartCountBadge from "./cmponents/common/CartCountBadge";
import { AlertProvider } from "@/contexts/AlertContext";
// import CommonTextHeaderView from "../admin/components/Common/TextHeader/View";
export default function MemberLayout({ children }) {
  return (
    <AlertProvider>
      <UserDataProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <AnimatePresence mode="wait">
              <main className="flex-1 bg-white p-2">{children}</main>
            </AnimatePresence>
            <Footer />
            <CartCountBadge />
          </div>
        </CartProvider>
      </UserDataProvider>
    </AlertProvider>
  );
}
