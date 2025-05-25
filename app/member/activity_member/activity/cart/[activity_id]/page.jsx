"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { formatDateToThaiBE } from '@/utils/formatdatelocal'
function page() {

    const p = useParams();
    const activity_id = p?.activity_id;

    const [subactivity, setSubActiivity] = useState(null)
    const [main, setMain] = useState(null)
    const [loading, setLoading] = useState(true)

    // method 
    async function GetActivity(params) {
        try {

            const res = await axios.get(`/api/subActivity/getSubByActivity/${params}`)
            const res_main = await axios.get(`/api/activity/${params}`)
            setMain(res_main.data);
            setSubActiivity(res.data.data);
            console.log(res.data.data);
            setLoading(false)
        } catch (err) {
            console.log(err.message);
        }
    }



    useEffect(() => {
        if (activity_id > 0) {
            GetActivity(activity_id)
        }
    }, [activity_id])

    return (
        <div>
            {/* main */}
            <div className=" bg-gray-100 rounded-sm shadow-md">
                {
                    main ? (

                        <div className="p-4 border-2 border-gray-800 rounded-sm shadow-md text-white bg-gray-800 space-y-2">
                            <div>
                                <span className="font-semibold text-orange-400 w-40">ชื่อกิจกรรม:</span> {main.activity_name}
                            </div>
                            <div>
                                <span className="font-semibold text-orange-400 w-40">รายละเอียด:</span> {main.activity_description}
                            </div>
                            <div>
                                <span className="font-semibold text-orange-400 w-40">จำนวนรับ:</span> {main.activity_max}
                            </div>
                            <div>
                                <span className="font-semibold text-orange-400 w-40">วันที่เริ่ม:</span> {formatDateToThaiBE(main.activity_start)}
                            </div>
                        </div>
                    )
                        : (
                            <div className=""></div>
                        )
                }
            </div>

            {/* subactivity */}
            <div className="grid grid-cols-1 mt-2 gap-2">
                {subactivity && Array.isArray(subactivity) ? (
                    subactivity.map((sub, index) => (
                        <div key={index} className="p-3 border rounded-lg shadow">
                            <div className="font-semibold text-orange-400">Subactivity Name:</div>
                            <div>{sub.sub_activity_name}</div>
                            <div className="font-semibold text-orange-400 mt-2">Details:</div>
                            <div>{sub.sub_activity_description}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-300 flex justify-center items-center">{!loading ? "ไม่มีข้อมูล" : "กำลังโหลด"}</div>
                )}
            </div>


        </div>
    )
}

export default page
