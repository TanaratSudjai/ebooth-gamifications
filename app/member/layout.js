import React from "react";
import Navbar from "./cmponents/common/Navbar";
import Footer from "./cmponents/common/Footer";
import MotionLayout from "./cmponents/common/MotionLayout";
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
            <MotionLayout>
              <main className="flex-1 bg-[#353e5d] p-2 mb-24">{children}</main>
            </MotionLayout>
            <Footer />
            <CartCountBadge />
          </div>
        </CartProvider>
      </UserDataProvider>
    </AlertProvider>
  );
}
