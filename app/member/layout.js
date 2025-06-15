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
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <MotionLayout>
              <main className="p-2 min-h-screen bg-white">{children}</main>
            </MotionLayout>
            <Footer />
            <CartCountBadge />
          </div>
        </CartProvider>
      </UserDataProvider>
    </AlertProvider>
  );
}
