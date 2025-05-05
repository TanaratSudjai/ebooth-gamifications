"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from 'axios';
function page() {
  const { data: session, status } = useSession();
  const [subActivity, setSubActivity] = useState([])


  const fetch = async () => {
    const res = await axios.get('/api/subActivity')
    console.log(res.data.data);
    setSubActivity(res.data.data)
  }


  useEffect(() => {
    fetch()
  }, [])

  return (
    <div className="bg-white text-black flex gap-2 flex-col">
      <div className="">
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
      <div className="">
        {
          subActivity.length === 0 ? (
            <div className="">found</div>
          ) : (
            <div className="flex gap-2">
              {subActivity.map((item) => (
                <div className="border" key={item.sub_activity_id} >
                  <h1>{item.sub_activity_name}</h1>
                  <img src={item.qr_image_url} alt="" />
                </div>
              ))}
            </div>

          )
        }
      </div>
    </div>
  );
}

export default page;
