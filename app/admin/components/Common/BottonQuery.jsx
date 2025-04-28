import React from "react";

function BottonQuery({ color, params, text }) {
  const hendleParams = async (params) => {
    console.log(params);
  };

  return (
    <div>
      <button
        onClick={() => hendleParams(params)}
        className={`p-1 md:px-3 w-full md:w-auto lg:px-3 border-2 border-gray-200 shadow-md cursor-pointer  ${color} text-center w-auto font-light rounded-lg`}
      >
        {text}
      </button>
    </div>
  );
}

export default BottonQuery;
