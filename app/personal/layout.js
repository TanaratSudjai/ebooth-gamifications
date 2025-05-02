//layout for admin pages
import React from "react";
import { AlertProvider } from "@/contexts/AlertContext";
export default function PersonalLayout({ children }) {
  return (
    <div>
      <AlertProvider>
        <div>{children}</div>
      </AlertProvider>
    </div>
  );
}
