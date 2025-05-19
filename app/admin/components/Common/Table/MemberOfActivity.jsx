"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useAlert } from '@/contexts/AlertContext';
function MemberOfActivity({ id_main = 0 }) {
    const [member, setMember] = useState([])
    const { showSuccess, showError } = useAlert();

    const fetchData = async () => {
        try {
            if (id_main !== 0) {
                const response = await axios.get(`/api/personnel/getMemberByActivityId/${id_main}`);
                setMember(response.data.data.members);
                console.log(response.data.data.members);
                // console.log("🚀 ~ file: page.jsx:12 ~ fetchData ~ response.data:", response.data.data.members)
            }
        } catch (error) {
            console.error(error);
        }
    }
    const onClickCheckIn = async (member_id) => {
        console.log("member_id", member_id);
        console.log("id_main", id_main);

        try {
            const response = await axios.put(
                `/api/checkin/updateCheckin/onActivity`,
                { member_id: member_id, activity_id: id_main }
            );
            if (response.status === 200) {
                showSuccess("ทำรายการสำเร็จ", "ทำการเช็คอินสําเร็จ");
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (id_main && id_main !== 0) {
            fetchData();
        }
    }, [id_main]);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ชื่อ
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                นามสกุล
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เช็คอิน
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {member.map((person) => (
                            <tr key={person.member_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.member_address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.member_username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {person.is_checkin === 0 ? (
                                        <button
                                            onClick={() => onClickCheckIn(person.member_id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            เช็คอิน
                                        </button>
                                    ) : (
                                        <span className="text-green-500">เช็คอินแล้ว</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default MemberOfActivity




