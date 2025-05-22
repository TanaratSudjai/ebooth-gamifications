"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";

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

  const sendCheckIn = async () => {
    if (
      form.activity_id &&
      form.sub_activity_id &&
      form.member_id &&
      !checkInInProgress
    ) {
      setCheckInInProgress(true);
      try {
        await axios.post("/api/checkin/ifCheckIn", form);
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

  useEffect(() => {
    sendCheckIn();
  }, [form, subActivities]);

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
            F;
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
        // log error if needed
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
    <div className="text-gray-800 p-4 sm:p-6">
      <div className="h-24 bg-white shadow rounded-2xl p-5">
        <div className="flex">
          <span className="w-24">ชื่อผู้ใช้</span> {session?.user?.username}
        </div>
        <div className="flex">
          <span className="w-24">อีเมล</span> {session?.user?.email}
        </div>
      </div>
      <div id="qr-reader" className="mt-6"></div>
      <div className="container mx-auto max-w-4xl space-y-8">
        <AnimatePresence>
          {scanning && (
            <motion.div
              id="qr-reader"
              className="mt-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        <div className="flex-1">
          <button
            onClick={startScan}
            disabled={scanning}
            className="bg-indigo-600 text-white px-6 py-2 w-full rounded-md shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {scanning ? "กำลังสแกน..." : "เริ่มสแกน QR"}
          </button>

          {scanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 flex justify-center"
            >
              <button
                onClick={stopScan}
                className="bg-black text-white px-6 py-2 w-full rounded-md shadow-md hover:bg-red-700 transition disabled:opacity-50"
              >
                ยกเลิกสแกน
              </button>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {scanSuccess && selectedActivity && (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 bg-green-100 p-4 rounded-lg text-green-700 text-center shadow"
            >
              ✅ เข้าร่วมกิจกรรมย่อย:{" "}
              <strong>{selectedActivity.sub_activity_name}</strong>{" "}
              เรียบร้อยแล้ว
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Page;
