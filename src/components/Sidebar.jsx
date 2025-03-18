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
  } from "@heroicons/react/24/solid";
import { useOpenStore } from "../Store";
import { Link } from "react-router-dom";
   
  export function DefaultSidebar() {
    const { open} = useOpenStore()
    return (
      <Card className={`h-screen transform transition-transform duration-300 ease-in-out hidden  ${open ? 'md:translate-x-0 md:block' : 'md:-translate-x-full md:hidden'} transition-all  p-4 shadow-none  shadow-blue-gray-900/5`}>
        <div className="mb-2 p-4">
          <Typography variant="h5" className="text-[#4B0082]">
            Sidebar
          </Typography>
        </div>
        <List>
        <Link to ='/' className="hover:bg-[#efd8ff] rounded-lg ">
          <ListItem className=" active:bg-[#efd8ff] focus:bg-[#efd8ff] hover:bg-[#efd8ff]">
                <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
          </ListItem>
        </Link>
        <Link to ='/Users' className="hover:bg-[#efd8ff] rounded-lg">
        <ListItem className="hover:bg-[#efd8ff] active:bg-[#efd8ff]">
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            E-Commerce
          </ListItem>
        </Link>
          <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Inbox
            <ListItemSuffix>
              <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
            </ListItemSuffix>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
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
    );
  }