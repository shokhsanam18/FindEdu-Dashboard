import React from "react";
import { Drawer, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { UserCircleIcon, PowerIcon, Cog6ToothIcon, InboxIcon } from "@heroicons/react/24/solid";
import { useSidebarStore } from "../Store";

export function Sidebar() {
  const { side, closeSidebar } = useSidebarStore();

  return (
    <Drawer className={`md:hidden block`} open={side} onClose={closeSidebar}>
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

import { useState } from "react";

export default function CustomSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        className="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-slate-800 border-slate-800 text-slate-50 hover:bg-slate-700 hover:border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle Sidebar
      </button>

      {/* Sidebar */}
      <div
        className={`z-10 fixed top-0 left-0 h-screen w-64 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="w-full rounded-lg border shadow-sm overflow-hidden bg-white border-slate-200 shadow-slate-950/5 max-w-[280px] h-screen">
          <div className="rounded m-2 mx-3 mb-0 mt-3 flex h-max items-center gap-2">
            <img src="/logo.png" alt="brand" className="inline-block object-cover object-center w-6 h-6 rounded-sm" />
            <p className="font-sans antialiased text-base text-current font-semibold">Material Tailwind</p>
          </div>
          <div className="w-full h-max rounded p-3">
            <div className="relative w-full">
              <input
                placeholder="Search here..."
                type="search"
                className="w-full outline-none focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-600/60 ring-transparent border border-slate-200 transition-all ease-in disabled:opacity-50 disabled:pointer-events-none select-none text-sm py-2 px-2.5 ring shadow-sm bg-white rounded-lg duration-100 hover:border-slate-800 hover:ring-slate-800/10 focus:border-slate-800 focus:ring-slate-800/10"
              />
            </div>
            <ul className="flex flex-col gap-0.5 min-w-60 mt-3">
              <SidebarItem icon={"📩"} text="Inbox" badge={14} />
              <SidebarItem icon={"📤"} text="Sent" />
              <SidebarItem icon={"📝"} text="Drafts" />
              <SidebarItem icon={"📌"} text="Pins" />
              <SidebarItem icon={"📁"} text="Archive" />
              <SidebarItem icon={"🗑️"} text="Trash" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, badge }) {
  return (
    <li className="flex items-center py-1.5 px-2.5 rounded-md text-slate-600 hover:text-slate-800 hover:bg-slate-200">
      <span className="grid place-items-center shrink-0 me-2.5">{icon}</span>
      {text}
      {badge && (
        <span className="grid place-items-center shrink-0 ps-2.5 ms-auto">
          <div className="relative inline-flex w-max items-center border font-sans font-medium rounded-md text-xs p-0.5 bg-slate-800/10 border-transparent text-slate-800 shadow-none">
            <span className="font-sans text-current leading-none my-0.5 mx-1.5">{badge}</span>
          </div>
        </span>
      )}
    </li>
  );
}


