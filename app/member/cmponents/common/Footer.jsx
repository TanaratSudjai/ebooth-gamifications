import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      {/* <div className="flex flex-wrap justify-around items-center p-4 gap-4">
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition">
          HOME
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition">
          ABOUT
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition">
          SERVICES
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition">
          CONTACT
        </button>
      </div> */}
      <div className="text-center text-xs py-2 border-t border-gray-600">
        &copy; 2025 Webb Application eBooth All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
