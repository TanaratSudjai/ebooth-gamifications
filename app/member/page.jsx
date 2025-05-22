"use client";

import React, { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
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

  const startScan = () => {
    if (scanning) return;
    setScanning(true);

    // Clear any existing scanner instance
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
        // Optional error handler
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
        {/* Header Section */}
        <header className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-blue-800">
            QR Check-in System
          </h1>
          <p className="text-gray-600 mt-2">
            Scan a QR code to check in to an activity
          </p>
        </header>

        {/* QR Scanner Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

          <div className="flex items-center mb-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={startScan}
                disabled={scanning}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {scanning ? "Scanning..." : "Start Scan"}
              </button>

              {scanning && (
                <div
                  id="qr-reader"
                  className="w-[300px] h-[300px] border rounded shadow"
                />
              )}

              <input
                ref={inputRef}
                readOnly
                className="border p-2 w-full max-w-md mt-4"
                placeholder="QR data will appear here"
              />

              {scanSuccess && selectedActivity && (
                <p className="text-green-600">
                  ✅ Check-in สำเร็จ: {selectedActivity.sub_activity_name}
                </p>
              )}
            </div>
          </div>
          {scanning && (
            <button
              onClick={stopScan}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Stop Scan
            </button>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            {!scanning ? (
              <button
                onClick={startScan}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 rounded-lg transition shadow-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Start Scanning
              </button>
            ) : (
              <button
                onClick={stopScan}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-3 rounded-lg transition shadow-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Stop Scanning
              </button>
            )}
          </div>

          <input
            type="text"
            ref={inputRef}
            readOnly
            className="hidden border p-2 mt-2 w-full bg-gray-100"
          />

          <div
            id="qr-reader"
            className="mt-4 mx-auto max-w-md rounded-lg overflow-hidden shadow-inner"
          />

          {scanning && (
            <div className="flex justify-center mt-4">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          )}
        </section>

        {/* Member Info */}
        {session?.user && (
          <section className="bg-white shadow-lg rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>

            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Member Info
              </h2>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100 mb-4">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">
                    Username:
                  </span>
                  <span className="text-gray-800">{session.user.username}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">
                    Email:
                  </span>
                  <span className="text-gray-800">{session.user.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">ID:</span>
                  <span className="text-gray-800">{session.user.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">EXP:</span>
                  <span className="text-gray-800">{session.user.exp}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">
                    Points:
                  </span>
                  <span className="text-gray-800">
                    {session.user.point_total} (Remain:{" "}
                    {session.user.point_remain})
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">
                    Address:
                  </span>
                  <span className="text-gray-800">{session.user.address}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-700 font-medium w-24">
                    Admin:
                  </span>
                  <span className="text-gray-800">
                    {session.user.is_admin ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-5 py-2 rounded-lg transition shadow flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </section>
        )}

        {/* Sub Activities */}
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
              Available Activities
            </h2>
          </div>

          {subActivities.length === 0 ? (
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-blue-700 font-medium">
                Loading activities...
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

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-4">
          <p>
            © {new Date().getFullYear()} QR Check-in System. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Page;
