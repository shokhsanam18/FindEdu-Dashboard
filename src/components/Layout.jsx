import React from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar  from "./MiniSidebar";
import { ComplexNavbar } from "./Navbar";
import { DefaultSidebar } from "./Sidebar";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <DefaultSidebar/>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <ComplexNavbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
