"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadData from "../Load/LoadData";
import { useRouter } from "next/navigation";
// icons
import { useAlert } from "@/contexts/AlertContext";
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
function MissionData() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const { showError, showSuccess } = useAlert();
  //   method
  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/mission?page=${page}&limit=${limit}&search=${search}`
      );
      console.log(response.data.data);

      setMissions(response.data.data.data);
      setTotalPages(response.data.total);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  //   useEffect
  useEffect(() => {
    fetchMissions();
  }, [page, limit, search]);

  //   hendle btn
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/mission/${id}`);
      if (response.status === 200) {
        showSuccess("ทำรายการสำเร็จ", "ลบภารกิจสําเร็จ");
        fetchMissions();
      } else {
        showError("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (err) {
      console.error("Error deleting mission data:", err);
    }
  };
  const handleEdit = (id) => {
    router.push(`/admin/mission/${id}`);
  };

  return (
    <div>
      <div className="overflow-x-auto md:overflow-hidden   border mt-10  border-base-content/5">
        {/* table */}
        <table className="table border border-base-content/5 px-3">
          <thead>
            <tr className="text-center bg-gray-200 text-gray-800 ">
              <th className="px-2 py-2 whitespace-nowrap">ลําดับ</th>
              <th className="px-2 py-2 whitespace-nowrap">ชื่อภารกิจ</th>
              <th className="px-2 py-2 whitespace-nowrap">เเต้มที่ได้</th>
              <th className="px-2 py-2 whitespace-nowrap">สถานะ</th>
              <th className="px-2 py-2 whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          {/*  // table data */}
          <tbody>
            {!loading ? (
              missions.map((missions, index) => (
                <tr
                  key={index + 1}
                  onClick={() => handleDetail(missions.mission_id)}
                  className="text-center hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-all duration-300 hover:scale-[1.01]"
                >
                  <td className="table-cell-style">
                    {index + 1 + (page - 1) * limit}
                  </td>
                  <td className="table-cell-style">{missions.mission_name}</td>
                  <td className="table-cell-style">
                    {missions.mission_points}
                  </td>
                  <td className="table-cell-style">
                    {missions.mission_active}
                  </td>

                  {/* ปุ่มแก้ไข / ลบ */}
                  <td
                    className="px-2 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center items-center gap-2">
                      {/* Edit */}
                      <button
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(missions.mission_id);
                        }}
                      >
                        <RiFileEditFill />
                      </button>

                      {/* Delete */}
                      <button
                        className="action-button-del "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(missions.mission_id);
                        }}
                      >
                        <MdDeleteSweep />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-10 text-center">
                  <LoadData />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* btn pagination */}
        <div className="pagination container mx-auto px-10 flex justify-center gap-5 items-center mt-4">
          <button
            className="action-button text-center cursor-pointer"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <MdArrowBackIos />
          </button>
          <span className="text-black font-bold"> หน้า {page}</span>
          <button
            className="action-button text-center cursor-pointer"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <GrNext />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MissionData;
