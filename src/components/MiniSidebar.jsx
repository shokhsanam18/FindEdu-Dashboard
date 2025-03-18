import React, { useEffect, useState } from "react";
import { Drawer, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { UserCircleIcon, PowerIcon, Cog6ToothIcon, InboxIcon } from "@heroicons/react/24/solid";
import { useSidebarStore } from "../Store";

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
        <div className="mb-2 flex items-center gap-4 p-4">
          <Typography variant="h5" color="blue-gray">Sidebar</Typography>
        </div>
        <List>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Inbox
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    </Drawer>
  );
}



