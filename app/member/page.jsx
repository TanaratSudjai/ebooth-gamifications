"use client";
import React, { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function Page() {
  const { data: session } = useSession();
  const [subActivity, setSubActivity] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [form, setForm] = useState({
    activity_id: '',
    sub_activity_id: '',
    member_id: ''
  });

  const inputRef = useRef(null);

  const fetchSubActivities = async () => {
    const res = await axios.get("/api/subActivity");
    setSubActivity(res.data.data);
  };

  useEffect(() => {
    if (form.activity_id && form.sub_activity_id && form.member_id) {
      console.log("🚀 ส่ง payload นี้ไปใช้งาน:", form);

      // ถ้าจะส่งไป API
      // axios.post("/api/your-endpoint", form)
      //   .then((res) => console.log("✅ POST success", res.data))
      //   .catch((err) => console.error("❌ POST failed", err));
    }
  }, [form]);



  useEffect(() => {
    fetchSubActivities();
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
          inputRef.current.value = decodedText + " / " + session?.user.id;

          const numbers = decodedText.match(/\d+/g)?.map(Number) || [];

          if (numbers.length >= 0 && session?.user?.id) {
            const newForm = {
              activity_id: numbers[0],
              sub_activity_id: numbers[1],
              member_id: session.user.id,
            };

            setForm(newForm);
            console.log("✅ Form payload:", newForm); // ✅ Log form
          }
        }

        scanner.clear();
        setScanning(false);
      },
      (error) => {
        // QR not matched
      }
    );
  };

  return (
    <div className="bg-white text-black flex gap-4 flex-col p-4">
      {/* QR Scanner */}
      <div>
        <button onClick={startScan} className="bg-blue-500 text-white px-4 py-2 rounded">Request Camera</button>
        <input type="text" ref={inputRef} className="border p-2 mt-2 w-full" readOnly />
        <div id="qr-reader" className="mt-4" />
      </div>

      {/* User Info */}
      <div>
        <h1>Member Page</h1>
        <h2>Welcome, {session?.user.username}</h2>
        <h3>Email: {session?.user.email}</h3>
        <h3>ID: {session?.user.id}</h3>
        <h3>EXP: {session?.user.exp}</h3>
        <h3>Points: {session?.user.point_total} (Remain: {session?.user.point_remain})</h3>
        <h3>Address: {session?.user.address}</h3>
        <h3>Admin: {session?.user.is_admin ? "Yes" : "No"}</h3>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Sub Activity List */}
      <div>
        {subActivity.length === 0 ? (
          <p>Loading sub-activities...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
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
