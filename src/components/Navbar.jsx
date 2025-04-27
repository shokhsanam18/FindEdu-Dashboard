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
import Sidebar  from "./MiniSidebar";
import { useOpenStore, useSidebarStore } from "../Store";
import { Search } from "lucide-react"

const profileMenuItems = [
  // {
  //   label: "My Profile",
  //   icon: UserCircleIcon,
  //   link: '/MyProfile'
  // },
  // {
    //   label: "Edit Profile",
    //   icon: Cog6ToothIcon,
    // },
    // {
      //   label: "Inbox",
      //   icon: InboxArrowDownIcon,
      // },
      // {
  //   label: "Help",
  //   icon: LifebuoyIcon,
  // },
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
    logout(); // Clear tokens + user state
    navigate("/Login"); // Redirect to login
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
            <Link to={`${isLastItem
                ? "#"
                : link}`}
                key={label}>
            <MenuItem
            onClick={isLastItem ? handleLogout : closeMenu}
            className={`flex items-center  gap-2 rounded ${
              isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : "hover:bg-[#efd8ff] focus:bg-[#efd8ff] active:bg-[#efd8ff]"
                }`}
                >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : "text-[#290a3f]"}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className={`font-normal ${isLastItem ? "text-red-500" : "text-[#290a3f]"}`}
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

// // nav list menu
// const navListMenuItems = [
//   {
//     title: "@material-tailwind/html",
//     description:
//       "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
//   },
//   {
//     title: "@material-tailwind/react",
//     description:
//       "Learn how to use @material-tailwind/react, packed with rich components for React.",
//   },
//   {
//     title: "Material Tailwind PRO",
//     description:
//       "A complete set of UI Elements for building faster websites in less time.",
//   },
// ];

// function NavListMenu() {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const renderItems = navListMenuItems.map(({ title, description }) => (
//     <a href="#" key={title}>
//       <MenuItem>
//         <Typography variant="h6" color="blue-gray" className="mb-1">
//           {title}
//         </Typography>
//         <Typography variant="small" color="gray" className="font-normal">
//           {description}
//         </Typography>
//       </MenuItem>
//     </a>
//   ));

//   return (
//     <React.Fragment>
//       <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
//         <MenuHandler>
//           <Typography as="a" href="#" variant="small" className="font-normal">
//             <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
//               <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
//               Pages{" "}
//               <ChevronDownIcon
//                 strokeWidth={2}
//                 className={`h-3 w-3 transition-transform ${
//                   isMenuOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </MenuItem>
//           </Typography>
//         </MenuHandler>
//         <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
//           <Card
//             color="blue"
//             shadow={false}
//             variant="gradient"
//             className="col-span-3 grid h-full w-full place-items-center rounded-md"
//           >
//             <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
//           </Card>
//           <ul className="col-span-4 flex w-full flex-col gap-1">
//             {renderItems}
//           </ul>
//         </MenuList>
//       </Menu>
//       <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
//         <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
//         Pages{" "}
//       </MenuItem>
//       <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
//         {renderItems}
//       </ul>
//     </React.Fragment>
//   );
// }

// // nav list component
// const navListItems = [
//   {
//     label: "Account",
//     icon: UserCircleIcon,
//   },
//   {
//     label: "Blocks",
//     icon: CubeTransparentIcon,
//   },
//   {
//     label: "Docs",
//     icon: CodeBracketSquareIcon,
//   },
// ];

// function NavList() {
//   return (
//     <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
//       <NavListMenu />
//       {navListItems.map(({ label, icon }, key) => (
//         <Typography
//           key={label}
//           as="a"
//           href="#"
//           variant="small"
//           color="gray"
//           className="font-medium text-blue-gray-500"
//         >
//           <MenuItem className="flex items-center gap-2 lg:rounded-full">
//             {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
//             <span className="text-gray-900"> {label}</span>
//           </MenuItem>
//         </Typography>
//       ))}
//     </ul>
//   );
// }

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

  // const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

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
  {name: "light", link: "/Settings"},
  {name: "dark", link: "/Settings"},
]

const formattedUserNames = userData.map(data => ({ name: data.name, link: data.link }));
const formattedCenters = Centers.map(center => ({ name: center.name }));
const CombinedData = [...fields, ...majors, ...formattedUserNames, ...formattedCenters, ...theme];

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
    {name: "light", link: "/Settings"},
    {name: "dark", link: "/Settings"},
  ]
  const users = (JSON.parse(localStorage.getItem("userData")) || [])
  const majors = (JSON.parse(localStorage.getItem("majors")) || [])
  const centers = (JSON.parse(localStorage.getItem("Centers")) || [])
  const Theme = theme.map((item) => ({ name: item.name, link: item.link }));
  const savedData = [...users, ...majors, ...centers, ...Theme];  



const foundItem = savedData ? 
  savedData.find((data) => data?.name?.trim() === item?.name?.trim()) 
  : savedData === "light" || savedData === "dark" ? navigate("/Settings") : null;

  if (foundItem) {
    navigate(foundItem.link); 
  } else {
    console.error("Link not found!", { savedData, item });
}}



  return (
    <Navbar className={`ease-in-out max-w-full dark:bg-gray-900 dark:text-white sticky z-50 bg-opacity-100 transition-all border-none duration-300 rounded-none  shadow-none top-0 right-0 ${open ? 'md:w-full' : 'md:w-full'}`}>
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
      <form className="relative flex items-center w-full max-w-lg bg-white shadow-md rounded-full border border-violet-600 p-1 overflow-hidden" onSubmit={(e) => e.preventDefault()}>
        <input type="search" className="flex-grow outline-none text-base px-4 py-2 rounded-full w-full" placeholder="Search..." value={query}
         onChange={(e) => {handleSearchFromLocalStorage(e)}}/>
        <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white rounded-full p-2 flex items-center justify-center shadow-sm transition-transform transform hover:scale-105">
        <Search />
        </button>
      </form>

      
      {query.length > 0 && localStorageSuggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-white shadow-lg rounded-md border border-gray-300 overflow-hidden max-h-48 overflow-y-auto animate-fade-in">
          {localStorageSuggestions.map((item, index) => (
            <div key={index} className="p-2 hover:bg-violet-100 cursor-pointer transition-all text-smcursor-pointer"
        onClick={() => handleSelect(item)}>{item.name}</div>
          ))}
        </div>
      )}
    </div>


        {/* <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
 
        <Button size="sm" variant="text">
          <span>Log In</span>
        </Button> */}
        <ProfileMenu />
      </div>
      {/* <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav> */}
    </Navbar>
  );
}
