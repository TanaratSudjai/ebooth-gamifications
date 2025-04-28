import React from "react";
import ButtonBack from "@/app/admin/components/Common/BottonBack";

function View({ text, dis }) {
  return (
    <div className="flex items-center justify-start gap-5">
      {!dis && (
        <ButtonBack
          text="ย้อนกลับ"
          color="bg-gray-400"
          part="activity"
          dis={dis}
        />
      )}
      <div className="text-2xl  text-gray-800 ">{text}</div>
    </div>
  );
}

export default View;
