import React from "react";
import { Link, Outlet } from "react-router-dom";
import CustomSidebar, { Sidebar } from "./MiniSidebar";
import { ComplexNavbar } from "./Navbar";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* <CustomSidebar/> */}
      <Sidebar />
      <div style={{ flex: 1 }}>
        <ComplexNavbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
