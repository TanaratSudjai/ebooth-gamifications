"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import CommonTextHeaderView from "@/app/admin/components/Common/TextHeader/View";
import { useAlert } from "@/contexts/AlertContext";
import CardActivity from "../../components/Common/Card/Activity";
function page() {
  const r = useRouter();
  const p = useParams();
  const id = p?.id;

  // lazyload
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlert();

  //   state
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState(null);

  //   method
  const fetchData = async () => {
    setLoading(true);
    try {
      if (id) {
        const response_member = await axios.get(`/api/user/profile/${id}`);
        const response_activity = await axios.get(`/api/activity`);
        setUser(response_member.data);
        setActivity(response_activity.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //  working
  useEffect(() => {
    if (id || id != 0) {
      fetchData();
    }
  }, [id]);

  return (
    <div>
      <CommonTextHeaderView text="รายละเอียดสมาชิก" dis={false} />
      <div className="container mx-auto p-5">
        <div>
          สวัสดีครับ{" "}
          <span className="text-lg font-bold">
            {user?.member_username || "......"}
          </span>{" "}
          คุณต้องการจอง
        </div>
        <div className="grid p-2 w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 ">
          {activity?.map((item, index) => {
            return (
              <div key={index}>
                <CardActivity
                  activity_id={item.activity_id}
                  activity_name={item.activity_name}
                  activity_description={item.activity_description}
                  activity_start={item.activity_start}
                  activity_end={item.activity_end}
                  activity_max={item.activity_max}
                  reward_points={item.reward_points}
                  organize_id={item.organize_id}
                  activity_price={item.activity_price}
                  sub_activity_count={item.sub_activity_count}
                  id_user={id || 0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default page;
