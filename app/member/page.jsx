"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";


function ScanSuccess({ activityName }) {
  return (
    <motion.div
      key="success-message"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-6 bg-green-100 p-4 rounded-lg text-green-700 text-center shadow"
    >
      ✅ เข้าร่วมกิจกรรมย่อย: <strong>{activityName}</strong> เรียบร้อยแล้ว
    </motion.div>
  );
}

function Page() {
  const { data: session } = useSession();

  const [subActivities, setSubActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [checkInInProgress, setCheckInInProgress] = useState(false);
  const [form, setForm] = useState({
    activity_id: "",
    sub_activity_id: "",
    member_id: "",
  });

  const inputRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const fetchSubActivities = async () => {
      try {
        const res = await axios.get("/api/subActivity");
        setSubActivities(res.data.data);
      } catch (err) {
        console.error("Failed to fetch sub activities:", err);
      } finally {
        setLoading(false);
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

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || devices.length === 0) {
          throw new Error("No camera devices found.");
        }

        const backCamera = devices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("environment")
        );
        const selectedDeviceId = backCamera?.id || devices[0].id;

        const scanner = new Html5Qrcode("qr-reader", {
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        });

        scannerRef.current = scanner;

        scanner.start(
          { deviceId: { exact: selectedDeviceId } },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
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

            scanner.stop().then(() => {
              scanner.clear();
              scannerRef.current = null;
              setScanning(false);
            });
          },
          (error) => {
            console.warn("Scan error", error);
          }
        );
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setScanning(false);
      });
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {
        console.warn("Error stopping scanner:", e);
      }
      scannerRef.current = null;
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 text-gray-800 p-4 sm:p-6">
      <div className="container mx-auto max-w-2xl space-y-8">
        <h1 className="text-2xl font-semibold text-center text-indigo-800">
          ระบบสแกน QR เพื่อเช็คชื่อ
        </h1>

        {loading && (
          <div className="text-center text-gray-500">
            กำลังโหลดข้อมูลกิจกรรม...
          </div>
        )}

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
              className="mt-4 flex justify-center flex-col items-center"
            >
              <button
                onClick={stopScan}
                className="bg-black text-white px-6 py-2 w-full rounded-md shadow-md hover:bg-red-700 transition"
              >
                ยกเลิกสแกน
              </button>
            </motion.div>
          )}
        </div>

        <div id="qr-reader" className="mt-6"></div>

        <AnimatePresence>
          {scanSuccess && selectedActivity && (
            <ScanSuccess activityName={selectedActivity.sub_activity_name} />
          )}
        </AnimatePresence>

        {selectedActivity && (
          <div className="bg-white p-4 rounded-md shadow text-gray-800">
            <h2 className="font-semibold text-lg mb-2">
              รายละเอียดกิจกรรมย่อย
            </h2>
            <p>
              <strong>ชื่อกิจกรรม:</strong> {selectedActivity.sub_activity_name}
            </p>
            <p>
              <strong>รหัสกิจกรรม:</strong> {selectedActivity.sub_activity_id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
