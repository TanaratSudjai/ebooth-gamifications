"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
function page() {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>Member Page</h1>
      <h2>Welcome, {session?.user.username}</h2>
      <h3>Your email: {session?.user.email}</h3>
      <h3>Your ID: {session?.user.id}</h3>
      <h3>Your Rank ID: {session?.user.rank_id}</h3>
      <h3>Your EXP: {session?.user.exp}</h3>
      <h3>Your Total Points: {session?.user.point_total}</h3>
      <h3>Your Remaining Points: {session?.user.point_remain}</h3>
      <h3>Your Address: {session?.user.address}</h3>
      <h3>Your Admin Status: {session?.user.is_admin}</h3>
      <h3>Your Session? ID: {session?.id}</h3>
      <h3>Your Session? Token: {session?.accessToken}</h3>
      <h3>Your Session? Expires: {session?.expires}</h3>

      <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
    </div>
  );
}

export default page;
