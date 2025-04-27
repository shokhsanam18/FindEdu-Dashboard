import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { useAuthStore } from "../Store";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import Sidebar from "./MiniSidebar";
import { useOpenStore, useSidebarStore } from "../Store";
import { Search } from "lucide-react";

const profileMenuItems = [
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center hover:bg-[#efd8ff] focus:bg-[#efd8ff] active:bg-[#efd8ff] gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-purple-900  p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 text-[#290a3f] transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, link }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <Link to={`${isLastItem ? "#" : link}`} key={label}>
              <MenuItem
                onClick={isLastItem ? handleLogout : closeMenu}
                className={`flex items-center  gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : "hover:bg-[#efd8ff] focus:bg-[#efd8ff] active:bg-[#efd8ff]"
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${
                    isLastItem ? "text-red-500" : "text-[#290a3f]"
                  }`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className={`font-normal ${
                    isLastItem ? "text-red-500" : "text-[#290a3f]"
                  }`}
                >
                  {label}
                </Typography>
              </MenuItem>
            </Link>
          );
        })}
      </MenuList>
    </Menu>
  );
}

import { IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import theme from "@material-tailwind/react/theme";

export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const { side, openSidebar, closeSidebar } = useSidebarStore();
  const { open, openOpen, closeOpen } = useOpenStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [localStorageSuggestions, setLocalStorageSuggestions] = useState([]);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  const fields = JSON.parse(localStorage.getItem("fields")) || [];
  const majors = JSON.parse(localStorage.getItem("majors")) || [];
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  const Centers = JSON.parse(localStorage.getItem("Centers")) || [];
  const theme = [
    { name: "light", link: "/Settings" },
    { name: "dark", link: "/Settings" },
  ];

  const formattedUserNames = userData.map((data) => ({
    name: data.name,
    link: data.link,
  }));
  const formattedCenters = Centers.map((center) => ({ name: center.name }));
  const CombinedData = [
    ...fields,
    ...majors,
    ...formattedUserNames,
    ...formattedCenters,
    ...theme,
  ];

  const handleSearchFromLocalStorage = (e) => {
    setQuery(e.target.value);

    if (e.target.value) {
      const filteredCombinedData = CombinedData.filter((item) => {
        const itemName = item?.name ? String(item.name) : "";
        return itemName.toLowerCase().includes(e.target.value.toLowerCase());
      });

      setLocalStorageSuggestions(filteredCombinedData);
    } else {
      setLocalStorageSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    const theme = [
      { name: "light", link: "/Settings" },
      { name: "dark", link: "/Settings" },
    ];
    const users = JSON.parse(localStorage.getItem("userData")) || [];
    const majors = JSON.parse(localStorage.getItem("majors")) || [];
    const centers = JSON.parse(localStorage.getItem("Centers")) || [];
    const Theme = theme.map((item) => ({ name: item.name, link: item.link }));
    const savedData = [...users, ...majors, ...centers, ...Theme];

    const foundItem = savedData
      ? savedData.find((data) => data?.name?.trim() === item?.name?.trim())
      : savedData === "light" || savedData === "dark"
      ? navigate("/Settings")
      : null;

    if (foundItem) {
      navigate(foundItem.link);
    } else {
      console.error("Link not found!", { savedData, item });
    }
  };

  return (
    <Navbar
      className={`ease-in-out max-w-full dark:bg-gray-900 dark:text-white sticky z-50 bg-opacity-100 transition-all border-none duration-300 rounded-none  shadow-none top-0 right-0 ${
        open ? "md:w-full" : "md:w-full"
      }`}
    >
      <div className="relative mx-auto flex  items-center justify-between text-blue-gray-900">
        <IconButton
          variant="text"
          size="lg"
          className="md:hidden text-[#290a3f] dark:bg-gray-900 dark:text-white active:bg-[#efd8ff] hover:bg-[#efd8ff] block"
          onClick={side ? closeSidebar : openSidebar}
        >
          {side ? (
            <XMarkIcon className="h-8 w-8 stroke-2" />
          ) : (
            <Bars3Icon className="h-8 w-8 stroke-2" />
          )}
        </IconButton>

        <IconButton
          variant="text"
          size="lg"
          className="md:block hover:bg-[#efd8ff]  dark:bg-gray-900 dark:text-white active:bg-[#efd8ff] text-[#290a3f] hidden"
          onClick={open ? closeOpen : openOpen}
        >
          {open ? (
            <XMarkIcon className="h-8 w-8 stroke-2" />
          ) : (
            <Bars3Icon className="h-8 w-8 stroke-2" />
          )}
        </IconButton>

        <div className="w-full flex flex-col items-center relative p-1">
          <form
            className="relative flex items-center w-full max-w-lg bg-white shadow-md rounded-full border border-violet-600 p-1 overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              className="flex-grow outline-none text-base px-4 py-2 rounded-full w-full"
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                handleSearchFromLocalStorage(e);
              }}
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-full p-2 flex items-center justify-center shadow-sm transition-transform transform hover:scale-105"
            >
              <Search />
            </button>
          </form>

          {query.length > 0 && localStorageSuggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full max-w-lg bg-white shadow-lg rounded-md border border-gray-300 overflow-hidden max-h-48 overflow-y-auto animate-fade-in">
              {localStorageSuggestions.map((item, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-violet-100 cursor-pointer transition-all text-smcursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <ProfileMenu />
      </div>
    </Navbar>
  );
}
