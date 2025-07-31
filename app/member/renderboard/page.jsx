import React from 'react'
import Image from "next/image";

function page() {
    return (
        <div>
            <div className="grid grid-cols-1 gap-1">
                <header className='border-b-2 border-gray-200 p-2 bg-white rounded'>
                    <h1>ตารางอันดับการเเข่งขัน <br /> กิจกรรม เข้าร่วมวัตนธรรมหล่อเทียน</h1>
                </header>
                <div className="p-2 bg-white border border-gray-200 rounded">
                    <div className="flex justify-around items-center">
                        <div className="logo rounded-full w-8 h-8">
                            <Image
                                src={"/member_icons/number_one.png"}
                                alt="กิจกรรม"
                                width={50}
                                height={50}
                            />
                        </div>
                        <div className="font-bold">Ms. Build suiza</div>
                        <div className="font-bold">Point 370</div>
                    </div>
                </div>
                <div className="p-2 bg-white border border-gray-200 rounded">
                    <div className="flex justify-around items-center">
                        <div className="logo rounded-full w-8 h-8">
                            <Image
                                src={"/member_icons/number_two.png"}
                                alt="กิจกรรม"
                                width={50}
                                height={50}
                            />
                        </div>
                        <div className="font-bold">Ms. Build suiza</div>
                        <div className="font-bold">Point 370</div>
                    </div>
                </div>
                <div className="p-2 bg-white border border-gray-200 rounded">
                    <div className="flex justify-around items-center">
                        <div className="logo rounded-full w-8 h-8">
                            <Image
                                src={"/member_icons/number_three.png"}
                                alt="กิจกรรม"
                                width={50}
                                height={50}
                            />
                        </div>
                        <div className="font-bold">Ms. Build suiza</div>
                        <div className="font-bold">Point 370</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
