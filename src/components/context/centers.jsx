// import { useEffect, useState } from "react";
// import axios from "axios";
// import { create } from "zustand";
// import {
//   Card,
//   CardBody,
//   Typography,
//   Spinner,
//   IconButton,
// } from "@material-tailwind/react";
// import { TrashIcon } from "@heroicons/react/24/solid";
// import AddCenter from "./add";

// const API_URL = "http://18.141.233.37:4000/api/centers";

// // Zustand Store for State Management
// const useCenterStore = create((set, get) => ({
//   centers: [],
//   loading: false,
//   error: "",
//   token: localStorage.getItem("authToken") || "",

//   fetchCenters: async () => {
//     set({ loading: true, error: "" });
//     try {
//       const response = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${get().token}` },
//       });
//       set({ centers: response.data.data || [] });
//     } catch (error) {
//       if (error.response?.status === 401) {
//         await get().refreshAuthToken();
//       } else {
//         set({ error: "Failed to fetch centers." });
//       }
//     } finally {
//       set({ loading: false });
//     }
//   },

//   refreshAuthToken: async () => {
//     try {
//       const response = await axios.post("http://18.141.233.37:4000/api/refresh-token", {
//         refreshToken: get().token,
//       });
//       const newToken = response.data.accessToken;
//       set({ token: newToken });
//       localStorage.setItem("authToken", newToken);
//       await get().fetchCenters();
//     } catch (error) {
//       set({ error: "Failed to refresh token. Please log in again." });
//     }
//   },

//   addCenter: async (centerData) => {
//     try {
//       const response = await axios.post(API_URL, centerData, {
//         headers: { Authorization: `Bearer ${get().token}` },
//       });
//       set((state) => ({ centers: [...state.centers, response.data] }));
//     } catch (error) {
//       set({ error: "Failed to add center." });
//     }
//   },

//   deleteCenter: async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: { Authorization: `Bearer ${get().token}` },
//       });
//       set((state) => ({ centers: state.centers.filter((center) => center.id !== id) }));
//     } catch (error) {
//       set({ error: "Failed to delete center." });
//     }
//   },
// }));

// const CentersManagement = () => {
//   const { centers, fetchCenters, deleteCenter, loading, error } = useCenterStore();

//   useEffect(() => {
//     fetchCenters();
//     const tokenInterval = setInterval(() => useCenterStore.getState().refreshAuthToken(), 15 * 60 * 1000);
//     return () => clearInterval(tokenInterval);
//   }, []);

//   return (
//     <Card className="mt-6 p-4">
//       <Typography variant="h4" color="blue-gray">
//         O'quv Markazlari
//       </Typography>
//       {error && <Typography color="red">{error}</Typography>}
//       <AddCenter />
//       <CardBody className="overflow-x-auto p-0">
//         {loading ? (
//           <Spinner className="mx-auto my-10" />
//         ) : (
//           <table className="w-full min-w-max table-auto text-left">
//             <thead>
//               <tr>
//                 <th className="border-b p-4">Nomi</th>
//                 <th className="border-b p-4">Joylashuvi</th>
//                 <th className="border-b p-4 text-right">Bajarish</th>
//               </tr>
//             </thead>
//             <tbody>
//               {centers.map((center) => (
//                 <tr key={center.id}>
//                   <td className="border-b p-4">{center.name}</td>
//                   <td className="border-b p-4">{center.location}</td>
//                   <td className="border-b p-4 text-right">
//                     <IconButton color="red" onClick={() => deleteCenter(center.id)}>
//                       <TrashIcon className="h-5 w-5" />
//                     </IconButton>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </CardBody>
//     </Card>
//   );
// };

// export default CentersManagement;
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  IconButton,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useCenterStore } from "../../Store";
import { useAuthStore } from "../../Store";

const CentersManagement = () => {
  const { centers, fetchCenters, deleteCenter, loading, error } =
    useCenterStore();
  const { refreshTokenFunc } = useAuthStore(); // Make sure your auth store is updated similarly

  useEffect(() => {
    fetchCenters();
    const tokenInterval = setInterval(() => refreshTokenFunc(), 15 * 60 * 1000);
    return () => clearInterval(tokenInterval);
  }, [fetchCenters, refreshTokenFunc]);

  const renderCellWithPopover = (text) => (
    <Popover placement="bottom-start">
      <PopoverHandler>
        <Typography className="truncate w-full max-w-[150px] cursor-pointer inline-block">
          {text || "N/A"}
        </Typography>
      </PopoverHandler>
      <PopoverContent>{text || "N/A"}</PopoverContent>
    </Popover>
  );

  return (
    <Card className="mt-6 p-4 overflow-hidden">
      <Typography variant="h4" color="blue-gray">
        O'quv Markazlari
      </Typography>
      {error && <Typography color="red">{error}</Typography>}
      <CardBody className="overflow-auto p-0">
        {loading ? (
          <Spinner className="mx-auto my-10" />
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b p-4">Nomi</th>
                <th className="border-b p-4">Joylashuvi</th>
                <th className="border-b p-4">Raqami</th>
                <th className="border-b p-4">Viloyat</th>
                <th className="border-b p-4">Yo'nalishi</th>
                <th className="border-b p-4">Bajarish</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center.id}>
                  <td className="border-b p-4 text-black">
                    {renderCellWithPopover(center.name)}
                  </td>
                  <td className="border-b p-4 w-[100px]">
                    {renderCellWithPopover(center.address)}
                  </td>
                  <td className="border-b p-4">
                    {renderCellWithPopover(center.phone)}
                  </td>
                  <td className="border-b p-4">
                    {renderCellWithPopover(center.regionId)}
                  </td>
                  <td className="border-b p-4">
                    {renderCellWithPopover(center.majorsId)}
                  </td>
                  <td className="border-b p-4">
                    <IconButton
                      color="red"
                      onClick={() => deleteCenter(center.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
};

export default CentersManagement;
