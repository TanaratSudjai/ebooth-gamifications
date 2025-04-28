"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BottonAddding from "../components/Common/BottonAddding";
import RankData from "../components/Common/Table/RankData";
import CommonTextHeaderView from "../components/Common/TextHeader/View";
function page() {
  return <div>
     <div className="flex flex-col md:flex-row gap-10 items-center mb-4">
        <BottonAddding
          text="เพิ่มระดับยศ"
          color="bg-yellow-400"
          part="rank"
        />
        <CommonTextHeaderView text="หน้าจัดการระดับยศ" dis={true} />
      </div>
      <RankData />
  </div>;
}

export default page;
