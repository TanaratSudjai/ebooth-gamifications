//layout for admin pages
import React from "react";
import { AlertProvider } from "@/contexts/AlertContext";
import Navbavigation from "./components/Common/Navbavigation";
export default function PersonalLayout({ children }) {
  return (
    <div>
      <AlertProvider>
        <div className="text-white bg-black min-h-screen">
          <Navbavigation />
          <div className="container mx-auto bg-base-200 p-2 rounded-b-2xl">{children}</div>
        </div>
      </AlertProvider>
    </div>
  );
}
