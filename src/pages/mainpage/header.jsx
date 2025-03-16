import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
const Header = () => {
  return (
    <div className="flex justify-between py-5 px-10 border-b border-gray-200">
      <h1 className="font-bold text-[#4B0082] text-xl uppercase flex-items-center">
        Welcome back,
        <span className="font-semibold text-[#5f3f75] "> Name of the User</span>
      </h1>
      <div className="flex gap-2">
        <RxDashboard className="border-2 border-gray-200 p-2 text-4xl rounded-lg hover:bg-[#4B0082] hover:text-white duration-300 cursor-pointer" />
        <IoNotificationsOutline className="border-2 border-gray-200 p-2 text-4xl rounded-lg hover:bg-[#4B0082] hover:text-white duration-300 cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
