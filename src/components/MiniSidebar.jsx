import React, { useEffect, useState } from "react";
import { Drawer, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";

import {
  PowerIcon, Cog6ToothIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  InboxIcon,
  UsersIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useSidebarStore } from "../Store";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { side, closeSidebar } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 720) closeSidebar();
    };
  
    window.addEventListener("resize", handleResize);
    handleResize(); 
  
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSidebar]);
  return (
    <Drawer className={`md:hidden `} open={side} onClose={closeSidebar}>
      <Card color="transparent" shadow={false} className="h-[calc(100vh-2rem)] w-full p-4">
        <Link to='/' onClick={closeSidebar}>
          <div className="mb-2 w-56 flex items-center gap-4 p-4">
            <img src="./img/logo.png" alt="" />
          </div>
        </Link>
        <List>
        <Link to ='/' onClick={closeSidebar} className="hover:bg-[#efd8ff] rounded-lg ">
          <ListItem className=" active:bg-[#efd8ff]  hover:text-[#290a3f] text-[#5f1d8e] focus:bg-[#efd8ff] hover:bg-[#efd8ff]">
                <ListItemPrefix className="text-[#290a3f]">
                <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
          </ListItem>
        </Link>
        <Link to ='/Users' onClick={closeSidebar} className="hover:bg-[#efd8ff] rounded-lg">
        <ListItem className="hover:bg-[#efd8ff]  hover:text-[#290a3f] focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <UsersIcon className="h-5 w-5" />
            </ListItemPrefix>
            Users
          </ListItem>
        </Link>
        <Link to ='/CEO' onClick={closeSidebar} className="hover:bg-[#efd8ff] rounded-lg">
          <ListItem className="hover:bg-[#efd8ff] hover:text-[#290a3f]  focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <AcademicCapIcon className="h-5 w-5" />
            </ListItemPrefix>
            CEO
          </ListItem>
        </Link>
        <Link to ='/Settings' onClick={closeSidebar} className="hover:bg-[#efd8ff] rounded-lg">
          <ListItem className="hover:bg-[#efd8ff]  hover:text-[#290a3f]  focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
        </Link>
        </List>
      </Card>
    </Drawer>
  );
}



