import React from "react";
import { Link, Outlet } from "react-router-dom";
import { SidebarWithBurgerMenu } from "./Sidebar";

const Layout = () => {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <SidebarWithBurgerMenu/>
        <Outlet />
      </div>
    </>
  );
};

export default Layout