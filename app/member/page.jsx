"use client";

import React, { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function Page() {
  const { data: session } = useSession();
  const [subActivities, setSubActivities] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [form, setForm] = useState({
    activity_id: "",
    sub_activity_id: "",
    member_id: "",
  });

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSubActivities = async () => {
      try {
        const res = await axios.get("/api/subActivity");
        setSubActivities(res.data.data);
      } catch (err) {
        console.error("Failed to fetch sub activities:", err);
      }
    };
    fetchSubActivities();
  }, []);

  useEffect(() => {
    const sendCheckIn = async () => {
      if (form.activity_id && form.sub_activity_id && form.member_id) {
        console.log("🚀 Sending payload:", form);
        try {
          await axios.post("/api/checkin/ifCheckIn", {
            activity_id: form.activity_id,
            member_id:form.member_id,
            sub_activity_id: form.sub_activity_id
          });
          console.log("✅ Check-in successful!");
        } catch (error) {
          console.error("❌ Check-in failed:", error);
        }
      }
    };
    sendCheckIn();
  }, [form]);

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
          inputRef.current.value = `${decodedText} / ${session?.user.id}`;

          const numbers = decodedText.match(/\d+/g)?.map(Number) || [];

          if (numbers.length >= 2 && session?.user?.id) {
            const newForm = {
              activity_id: numbers[0],
              sub_activity_id: numbers[1],
              member_id: session.user.id,
            };
            setForm(newForm);
            console.log("✅ Form updated:", newForm);
          }
        }

        scanner.clear();
        setScanning(false);
      },
      (error) => {
        // Optional: handle scan errors
      }
    );
  };

  return (
    <div className="bg-white text-black flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {/* QR Scanner Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">QR Code Scanner</h2>
        <button
          onClick={startScan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Start Scanning
        </button>
        <input
          type="text"
          ref={inputRef}
          readOnly
          className="border p-2 mt-2 w-full bg-gray-100"
        />
        <div id="qr-reader" className="mt-4" />
      </section>

      {/* User Info Section */}
      {session?.user && (
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Member Info</h2>
          <p><strong>Username:</strong> {session.user.username}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>ID:</strong> {session.user.id}</p>
          <p><strong>EXP:</strong> {session.user.exp}</p>
          <p><strong>Points:</strong> {session.user.point_total} (Remain: {session.user.point_remain})</p>
          <p><strong>Address:</strong> {session.user.address}</p>
          <p><strong>Admin:</strong> {session.user.is_admin ? "Yes" : "No"}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </section>
      )}

      {/* Sub Activities Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Sub Activities</h2>
        {subActivities.length === 0 ? (
          <p>Loading sub-activities...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {subActivities.map((item) => (
              <div
                key={item.sub_activity_id}
                className="border p-2 rounded shadow-sm text-center"
              >
                <h3 className="font-medium mb-2">{item.sub_activity_name}</h3>
                <img
                  src={item.qr_image_url}
                  alt={item.sub_activity_name}
                  className="w-28 mx-auto"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Page;
