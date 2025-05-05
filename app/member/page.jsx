"use client";
import React, { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function Page() {
  const { data: session, status } = useSession();
  const [subActivity, setSubActivity] = useState([]);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef(null);

  const fetch = async () => {
    const res = await axios.get("/api/subActivity");
    setSubActivity(res.data.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const startScan = () => {
    if (scanning) return;

    setScanning(true);

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        if (inputRef.current) {
          inputRef.current.value = decodedText + " + " + session?.user.id;
        }
        scanner.clear();
        setScanning(false);
      },
      (error) => {
        // console.warn(`QR Code no match: ${error}`);
      }
    );
  };

  return (
    <div className="bg-white text-black flex gap-2 flex-col p-4">
      <div>
        <button onClick={startScan}>Request Camera</button>
        <input type="text" ref={inputRef} className="border p-2" />
        <div id="qr-reader" className="mt-2" />
      </div>

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

      <div>
        {subActivity.length === 0 ? (
          <div>found</div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {subActivity.map((item) => (
              <div className="border p-2" key={item.sub_activity_id}>
                <h1>{item.sub_activity_name}</h1>
                <img src={item.qr_image_url} alt="" className="w-32" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
