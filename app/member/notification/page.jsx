import React from 'react';

const notifications = [
    {
        id: 1,
        type: "new_event",
        icon: "🔔",
        message: "กิจกรรม 'อบรม React เบื้องต้น' ถูกเพิ่มเมื่อ 10 นาทีที่แล้ว",
        timestamp: "2025-07-31T13:45:00Z"
    },
    {
        id: 2,
        type: "upcoming_event",
        icon: "⏰",
        message: "กิจกรรม 'สอบสัมภาษณ์ทุนวิจัย' จะเริ่มในอีก 30 นาที",
        timestamp: "2025-07-31T13:30:00Z"
    },
    {
        id: 3,
        type: "queue_update",
        icon: "⚠️",
        message: "ลำดับคิวของคุณถูกแซง ขณะนี้อยู่ลำดับที่ 8",
        timestamp: "2025-07-31T13:15:00Z"
    }
];

function Page() {
    return (
        <div className="p-4">
            <div className="rounded border border-gray-200 p-4 space-y-2">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="bg-white p-3 rounded shadow text-gray-800 flex items-start space-x-2"
                    >
                        <span className="text-xl">{notification.icon}</span>
                        <div>
                            <div>{notification.message}</div>
                            <div className="text-sm text-gray-500">
                                {new Date(notification.timestamp).toLocaleString("th-TH", {
                                    dateStyle: "short",
                                    timeStyle: "short"
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Page;
