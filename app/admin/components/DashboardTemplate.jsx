"use client";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import LoadPage from "./Common/Load/LoadPage";
import { RxActivityLog } from "react-icons/rx";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import { MdCardMembership } from "react-icons/md";
import { GiWantedReward } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { ImMenu } from "react-icons/im";
function DashboardTemplate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  async function to(path) {
    router.push(`/admin/${path}`);
  }

  const isActive = (path) => {
    if (pathname.startsWith(`/admin/${path}`)) {
      return "bg-amber-300 border border-gray-300 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-2 scale-105 transform";
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);
  return (
    <div className="flex justify-start items-start min-h-scrlg:p-0 ">
      <div className="drawer lg:drawer-open p-0 lg:p-0">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content bg-white">
          <div className="w-full flex justify-between items-center  p-3 shadow-2xl  lg:hidden">
            <label
              htmlFor="my-drawer-2"
              className="btn bg-amber-300 drawer-button lg:hidden"
            >
              <ImMenu />
            </label>
            <Image
              src="/logosvg/logo-github-svgrepo-com.svg"
              alt="menu"
              width={35}
              height={35}
            />
          </div>
          <div className="flex flex-col justify-start items-start min-h-screen  bg-gray-200 p-2 lg:p-2">
            {loading ? (
              <LoadPage />
            ) : (
              <div className=" bg-white rounded-xl p-4 shadow-xl  w-full lg:w-4/4">
                {children}
              </div>
            )}
          </div>
        </div>
        <div className="drawer-side ">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-white text-black h-full w-80 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <li className=" font-bold mb-4">
                {loading ? (
                  <div className="bg-gray-200 h-[150px] flex justify-center items-center text-lg font-bold text-center border-gray-200 rounded-2xl border-2">
                    <span className="loading loading-dots loading-lg"></span>
                  </div>
                ) : (
                  <div className="bg-gray-200 h-[150px] text-lg font-bold text-center border-gray-200 rounded-2xl border-2 flex flex-col justify-center items-center gap-2 shadow-md">
                    <div className="text-2xl">{session?.user?.username}</div>
                    <div className="text-sm text-gray-500">
                      {session?.user?.email}
                    </div>
                    {session?.user?.is_admin && (
                      <div className="text-sm bg-white  px-3 py-1 rounded-full shadow">
                        ผู้ดูแลระบบ
                      </div>
                    )}
                  </div>
                )}
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "activity"
                  )}`}
                  onClick={() => to("activity")}
                >
                  <RxActivityLog />
                  รายการกิจกรรม
                </button>
              </li>

              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "personnel"
                  )}`}
                  onClick={() => to("personnel")}
                >
                  <FaPersonCircleCheck />
                  จัดการบุคลากร
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "organize"
                  )}`}
                  onClick={() => to("organize")}
                >
                  <GoOrganization />
                  หน่วยงานที่จัดกิจกรรม
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "member"
                  )}`}
                  onClick={() => to("member")}
                >
                  <MdCardMembership />
                  จัดการสมาชิก
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "reward"
                  )}`}
                  onClick={() => to("reward")}
                >
                  <GiWantedReward />
                  จัดการของรางวัล
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "rank"
                  )}`}
                  onClick={() => to("rank")}
                >
                  <FaRankingStar />
                  จัดการระดับสมาชิก
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-2 rounded-lg border-gray-100 border-2 hover:scale-105 transform duration-300 ease-in-out transition hover:  ${isActive(
                    "dashboard"
                  )}`}
                  onClick={() => to("dashboard")}
                >
                  <MdDashboardCustomize />
                  แผลควบคุมกิจกรรม
                </button>
              </li>
            </div>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-neutral rounded-lg"
              >
                SING OUT
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardTemplate;
