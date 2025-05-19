"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaBuilding,
  FaMedal,
  FaGift,
  FaBell,
  FaCalendarAlt,
  FaChartLine,
  FaEllipsisH,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [activityUpComing, setActivityUpComing] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalOrganizes, setTotalOrganizes] = useState(0);
  const [totalMemberRanks, setTotalMemberRanks] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [newestActivities, setNewestActivities] = useState([]);
  const [newestOrganizes, setNewestOrganizes] = useState([]);
  const [totalMembersByMonth, setTotalMembersByMonth] = useState({});
  const [totalMembersByProvince, setTotalMembersByProvince] = useState([]);
  const [newMembersToday, setNewMembersToday] = useState(0);

  const route = useRouter();

  const handleAddActivity = () => {
    route.push("/admin/activity/0");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/dashboard`);
      console.log(response.data.activityUpComing);

      // ตรวจสอบและตั้งค่าข้อมูล
      setActivityUpComing(response.data.activityUpComing || []);

      setTotalMembers(response.data.totalMembers || 0);
      setTotalOrganizes(response.data.totalOrganizes || 0);
      setTotalMemberRanks(response.data.totalMemberRanks || 0);
      setTotalRewards(response.data.totalRewards || 0);
      setNewestActivities(response.data.newestActivities || []);
      setNewestOrganizes(response.data.newestOrganizes || []);
      setTotalMembersByMonth(response.data.totalMembersByMonth || {});
      setTotalMembersByProvince(response.data.totalMembersByProvince || []);
      setNewMembersToday(response.data.newMembersToday || 0);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // Enhanced stats data
  const stats = [
    {
      title: "จำนวนผู้ใช้",
      value: totalMembers,

      icon: <FaUsers size={30} className="text-amber-500" />,
    },
    {
      title: "องค์กรทั้งหมด",
      value: totalOrganizes,

      icon: <FaBuilding size={30} className="text-amber-500" />,
    },
    {
      title: "ยศสมาชิก",
      value: totalMemberRanks,

      icon: <FaMedal size={30} className="text-amber-500" />,
    },
    {
      title: "ของรางวัล",
      value: totalRewards,

      icon: <FaGift size={30} className="text-amber-500" />,
    },
  ];

  const barData = {
    labels: Object.keys(totalMembersByMonth),
    datasets: [
      {
        label: "จำนวนผู้สมัคร",
        data: Object.values(totalMembersByMonth),
        backgroundColor: "rgba(245, 158, 11, 0.8)",
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const lineData = {
    labels: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน"],
    datasets: [
      {
        label: "รายได้ (บาท)",
        data: [12000, 15000, 13000, 17000, 19000, 22000],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderWidth: 3,
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // ถ้าไม่มีข้อมูล หรือกำลังโหลดข้อมูล ให้แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-amber-500">
              สำหรับผู้ดูเเลภาพรวม
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-2">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              สวัสดี, ผู้ดูเเลระบบการจัดการกิจกรรม
            </h2>
            <p className="text-gray-500 mt-1">{currentDate}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => handleAddActivity()}
              className="px-4 cursor-pointer py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center"
            >
              <FaCalendarAlt className="mr-2" /> สร้างกิจกรรมใหม่
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 transition duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="bg-amber-50 p-3 rounded-lg">{stat.icon}</div>
              </div>
              <p className="text-sm text-gray-500 mt-4">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stat.value ? stat.value.toLocaleString() : "0"}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                รายได้รวมรายเดือน
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <FaEllipsisH />
              </button>
            </div>
            <div className="h-80">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        callback: function (value) {
                          return value.toLocaleString() + " ฿";
                        },
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                กิจกรรมที่กำลังจะมาถึง
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <FaEllipsisH />
              </button>
            </div>
            <div className="space-y-4">
              {activityUpComing && activityUpComing.length > 0 ? (
                activityUpComing.map((event, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-start">
                      <div className="bg-amber-50 text-amber-700 rounded-lg p-3 text-center min-w-14">
                        {event.date && (
                          <>
                            <div className="text-xs">
                              {event.date.split(" ")[1] || ""}
                            </div>
                            <div className="text-xl font-bold">
                              {event.date.split(" ")[0] || ""}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">
                          {event.activity_name || "ไม่มีชื่อกิจกรรม"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.activity_description || "-"}
                        </p>
                        <div className="mt-2 text-xs text-amber-600 font-medium">
                          {event.participants || 0} ผู้เข้าร่วม
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  ไม่มีกิจกรรมที่กำลังจะมาถึง
                </div>
              )}
              {activityUpComing && activityUpComing.length > 0 && (
                <button className="text-amber-500 hover:text-amber-600 text-sm font-medium w-full text-center pt-2">
                  ดูทั้งหมด
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                หน่วยงานล่าสุด
              </h2>
              <button
                onClick={() => route.push("/admin/organize")}
                className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-md font-medium hover:bg-amber-100 transition"
              >
                ดูทั้งหมด
              </button>
            </div>
            <div className="overflow-x-auto">
              {newestOrganizes && newestOrganizes.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b">
                      <th className="pb-3 font-medium">ชื่อองค์กร</th>
                      <th className="pb-3 font-medium">ที่อยู่</th>
                      <th className="pb-3 font-medium">สมาชิก</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newestOrganizes.map((org, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-0 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <td className="py-3 font-medium">
                          {org.organize_name || "ไม่ระบุชื่อ"}
                        </td>
                        <td className="py-3">
                          {org.organize_address || "ไม่ระบุที่อยู่"}
                        </td>
                        <td className="py-3">{org.organize_tel || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  ไม่มีข้อมูลองค์กรล่าสุด
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                กิจกรรมล่าสุด
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <FaEllipsisH />
              </button>
            </div>
            <div className="space-y-4">
              {newestActivities && newestActivities.length > 0 ? (
                newestActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-700">
                        {activity.activity_name || "ไม่มีรายละเอียด"}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-amber-600 font-medium">
                          {activity.activity_description}
                        </span>
                        <span className="text-xs text-gray-500">
                          {dayjs(activity.activity_date).format("DD/MM/YYYY") ||
                            ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-6">
                  ไม่มีกิจกรรมล่าสุด
                </div>
              )}
              {newestActivities && newestActivities.length > 0 && (
                <button
                  onClick={() => route.push("/admin/activity")}
                  className="text-amber-500 hover:text-amber-600 text-sm font-medium w-full text-center pt-2"
                >
                  ดูทั้งหมด
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
