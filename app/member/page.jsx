"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function Page() {
  const { data: session } = useSession();
  const [subActivities, setSubActivities] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [form, setForm] = useState({
    activity_id: "",
    sub_activity_id: "",
    member_id: "",
  });
  const [checkInInProgress, setCheckInInProgress] = useState(false);

  const inputRef = useRef(null);
  const scannerRef = useRef(null);

  // โหลดกิจกรรมย่อย
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

  // ส่งข้อมูล Check-In ไปยัง API
  useEffect(() => {
    const sendCheckIn = async () => {
      if (
        form.activity_id &&
        form.sub_activity_id &&
        form.member_id &&
        !checkInInProgress
      ) {
        setCheckInInProgress(true);
        try {
          await axios.post("/api/checkin/ifCheckIn", {
            activity_id: form.activity_id,
            member_id: form.member_id,
            sub_activity_id: form.sub_activity_id,
          });
          setScanSuccess(true);
          const activity = subActivities.find(
            (act) => act.sub_activity_id === parseInt(form.sub_activity_id)
          );
          setSelectedActivity(activity);
          setTimeout(() => setScanSuccess(false), 3000);
        } catch (error) {
          console.error("❌ Check-in failed:", error);
        } finally {
          setCheckInInProgress(false);
        }
      }
    };
    sendCheckIn();
  }, [form, subActivities]);

  // เริ่มสแกน QR
  const startScan = () => {
    if (scanning) return;
    setScanning(true);

    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
      rememberLastUsedCamera: true,
    });

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        if (inputRef.current) {
          inputRef.current.value = `${decodedText} / ${session?.user.id}`;
          const numbers = decodedText.match(/\d+/g)?.map(Number) || [];

          if (numbers.length >= 2 && session?.user?.id) {
            setForm({
              activity_id: numbers[0],
              sub_activity_id: numbers[1],
              member_id: session.user.id,
            });
          }
        }

        scanner.clear();
        scannerRef.current = null;
        setScanning(false);
      },
      (error) => {
        // สามารถใส่ log error ได้หากต้องการ
      }
    );
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (e) {
        console.warn("Scanner cleanup error:", e);
      }
      scannerRef.current = null;
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* ปุ่มสำหรับเริ่มสแกน */}
        <div className="flex justify-center">
          <button
            onClick={startScan}
            disabled={scanning}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {scanning ? "กำลังสแกน..." : "เริ่มสแกน QR"}
          </button>
        </div>
        <div id="qr-reader" className="mt-6"></div>

        {/* ส่วนแสดง QR Reader */}
        {scanning && (
          <div className="mt-4 flex justify-center">
            <div id="qr-reader" className="w-full max-w-md" />
          </div>
        )}

        {/* ข้อมูลที่ได้จากการสแกน */}
        {scanSuccess && selectedActivity && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg text-green-700 text-center shadow">
            ✅ เข้าร่วมกิจกรรมย่อย:{" "}
            <strong>{selectedActivity.sub_activity_name}</strong> เรียบร้อยแล้ว
          </div>
        )}

        {/* รายการกิจกรรม */}
        <section className="bg-white shadow-lg rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              กิจกรรมที่สามารถเข้าร่วมได้
            </h2>
          </div>

          {subActivities.length === 0 ? (
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-blue-700 font-medium">
                กำลังโหลดรายการกิจกรรม...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {subActivities.map((item) => (
                <div
                  key={item.sub_activity_id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 text-center">
                    <h3 className="font-medium mb-2 text-sm text-purple-800 group-hover:text-purple-900">
                      {item.sub_activity_name}
                    </h3>
                    <div className="bg-white p-2 rounded-lg shadow-inner">
                      <img
                        src={item.qr_image_url}
                        alt={item.sub_activity_name}
                        className="w-24 h-24 object-contain mx-auto group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="mt-2 text-xs text-purple-600">
                      ID: {item.sub_activity_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Page;
