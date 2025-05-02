"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
function Navbavigation() {
  const { data: session, status } = useSession();
  return (
    <div>
      <div className="navbar bg-neutral text-neutral-content">
        <button className="btn btn-ghost text-xl">
          สวัสดีคุณ! {session?.user?.username} 
        </button>
      </div>
    </div>
  );
}

export default Navbavigation;
