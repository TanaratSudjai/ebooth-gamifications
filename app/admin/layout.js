//layout for admin pages
import React from "react";


import DashboardTemplate from "./components/DashboardTemplate";
import { AlertProvider } from "@/contexts/AlertContext";
export default function AdminLayout({ children }) {
  return (
    <div>
      <AlertProvider>
        <DashboardTemplate children={children}></DashboardTemplate>
      </AlertProvider>
    </div>
  );
}
