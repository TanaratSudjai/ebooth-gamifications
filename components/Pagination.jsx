// // pages/profiles.js
// import { useState, useEffect } from "react";

// const ProfilesPage = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchProfiles = async (page) => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await getProfiles(page, 10); // ดึงข้อมูลจาก API
//       setProfiles(response.data);
//       setTotalPages(response.totalPages); // จำนวนหน้าทั้งหมด (สามารถส่งมาใน response)
//     } catch (err) {
//       setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfiles(page); // ดึงข้อมูลเมื่อหน้าเปลี่ยน
//   }, [page]);

//   return (
//     <div>
//       <h1>Profiles</h1>
//       {loading && <p>กำลังโหลด...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <ul>
//         {profiles.map((profile) => (
//           <li key={profile.id}>{profile.name}</li>
//         ))}
//       </ul>
//       <div>
//         <button
//           onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
//           disabled={page === 1}
//         >
//           Previous
//         </button>
//         <span>
//           {" "}
//           Page {page} of {totalPages}{" "}
//         </span>
//         <button
//           onClick={() =>
//             setPage((prevPage) => Math.min(prevPage + 1, totalPages))
//           }
//           disabled={page === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfilesPage;
