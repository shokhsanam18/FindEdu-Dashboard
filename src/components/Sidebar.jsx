import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
  } from "@material-tailwind/react";
  import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    UsersIcon,
    AcademicCapIcon,
  } from "@heroicons/react/24/solid";
import { useOpenStore } from "../Store";
import { Link } from "react-router-dom";
   
  export function DefaultSidebar() {
    const { open} = useOpenStore()
    return (
      <Card className={`h-screen z-50 sticky top-0 left-0 transform transition-transform duration-300 ease-in-out hidden  ${open ? 'md:translate-x-0 md:block' : 'md:-translate-x-full md:hidden'} transition-all  p-4 shadow-none  shadow-blue-gray-900/5`}>
        <Link to='/'>
          <div className="mb-2 p-4 w-56">
              <img src="./img/logo.png" alt="" />
          </div>
        </Link>
        <List>
        <Link to ='/' className="hover:bg-[#efd8ff] rounded-lg ">
          <ListItem className=" active:bg-[#efd8ff]  hover:text-[#290a3f] text-[#5f1d8e] focus:bg-[#efd8ff] hover:bg-[#efd8ff]">
                <ListItemPrefix className="text-[#290a3f]">
                <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
          </ListItem>
        </Link>
        <Link to ='/Users' className="hover:bg-[#efd8ff] rounded-lg">
        <ListItem className="hover:bg-[#efd8ff]  hover:text-[#290a3f] focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <UsersIcon className="h-5 w-5" />
            </ListItemPrefix>
            Users
          </ListItem>
        </Link>
        <Link to ='/CEO' className="hover:bg-[#efd8ff] rounded-lg">
          <ListItem className="hover:bg-[#efd8ff] hover:text-[#290a3f]  focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <AcademicCapIcon className="h-5 w-5" />
            </ListItemPrefix>
            CEO
          </ListItem>
        </Link>
        <Link to ='/Settings' className="hover:bg-[#efd8ff] rounded-lg">
          <ListItem className="hover:bg-[#efd8ff]  hover:text-[#290a3f]  focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
        </Link>
          <ListItem className="hover:bg-[#efd8ff]  hover:text-[#290a3f]  focus:bg-[#efd8ff] text-[#5f1d8e] active:bg-[#efd8ff]">
            <ListItemPrefix className="text-[#290a3f]">
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    );
  }