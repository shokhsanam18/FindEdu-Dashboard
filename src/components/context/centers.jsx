import { useEffect, useState, useRef } from "react";
import axios from "axios";

const CentersManagement = () => {
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(
        "http://18.141.233.37:4000/api/refresh-token",
        { refreshToken: tokenRef.current }
      );

      const newToken = response.data.accessToken;
      setToken(newToken);
      tokenRef.current = newToken;
      localStorage.setItem("authToken", newToken);
      console.log("Token updated:", newToken);

      fetchCenters(newToken);
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error);
      setError("Failed to refresh token. Please log in again.");
    }
  };

  const fetchCenters = async (authToken = tokenRef.current) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://18.141.233.37:4000/api/centers",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("API Response:", response.data);
      setCenters(response.data.data || []);
    } catch (error) {
      console.error("Error fetching centers:", error);
      if (error.response?.status === 401) {
        console.log("Token expired, refreshing...");
        await refreshAuthToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCenter = async () => {
    if (token) {
      try {
        const response = await axios.post(
          "http://18.141.233.37:4000/api/centers",
          newCenter,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCenters([...centers, response.data]);
        setNewCenter({ name: "", location: "" });
      } catch (error) {
        console.error("Error adding center:", error);
        setError("Failed to add center.");
      }
    } else {
      setError("Authentication token is missing.");
    }
  };

  // const handleDeleteCenter = async (centerId) => {
  //   if (token) {
  //     try {
  //       await axios.delete(
  //         `http://18.141.233.37:4000/api/centers/${centerId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setCenters(centers.filter((center) => center.id !== centerId));
  //     } catch (error) {
  //       console.error("Error deleting center:", error);
  //       setError("Failed to delete center.");
  //     }
  //   } else {
  //     setError("Authentication token is missing.");
  //   }
  // };

  const handleDeleteCenter = async (centerId) => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      console.log(`Attempting to delete center with ID: ${centerId}`);

      const response = await axios.delete(
        `http://18.141.233.37:4000/api/centers/${centerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Delete successful:", response.data);

      // Update state to remove deleted center
      setCenters((prevCenters) =>
        prevCenters.filter((center) => center.id !== centerId)
      );
    } catch (error) {
      console.error("Error deleting center:", error.response?.data || error);

      if (error.response) {
        if (error.response.status === 400) {
          setError("Bad request. Please check the center ID.");
        } else if (error.response.status === 401) {
          setError(
            "Not allowed to delete this center. Check your permissions."
          );
        } else if (error.response.status === 404) {
          setError("Center not found. It may have been deleted already.");
        } else {
          setError("Failed to delete center.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchCenters();

    const tokenInterval = setInterval(refreshAuthToken, 15 * 60 * 1000);

    return () => clearInterval(tokenInterval);
  }, []);

  return (
    <div className="centers-management">
      <h2>Centers Management</h2>

      {error && <div className="error-message">{error}</div>}

      <div>
        <h3>Add New Center</h3>
        <input
          type="text"
          placeholder="Name"
          value={newCenter.name}
          onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newCenter.location}
          onChange={(e) =>
            setNewCenter({ ...newCenter, location: e.target.value })
          }
        />
        <button onClick={handleAddCenter}>Add Center</button>
      </div>

      <h3>Centers List</h3>
      <ul>
        {loading ? (
          <p>Loading centers...</p>
        ) : centers.length > 0 ? (
          centers.map((center) => (
            <li key={center.id}>
              {center.name} - {center.location}
              <button onClick={() => handleDeleteCenter(center.id)}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No centers available.</p>
        )}
      </ul>
    </div>
  );
};

export default CentersManagement;

// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardBody,
//   Typography,
//   Input,
//   Button,
//   IconButton,
//   Spinner,
// } from "@material-tailwind/react";
// import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
// import AddCenter from "./add";

// const API_URL = "http://18.141.233.37:4000/api/centers";

// const CentersManagement = () => {
//   const [centers, setCenters] = useState([]);
//   const [newCenter, setNewCenter] = useState({ name: "", location: "" });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [token, setToken] = useState(localStorage.getItem("authToken") || "");
//   const tokenRef = useRef(token);

//   useEffect(() => {
//     tokenRef.current = token;
//   }, [token]);

//   const refreshAuthToken = async () => {
//     try {
//       const response = await axios.post(
//         "http://18.141.233.37:4000/api/refresh-token",
//         { refreshToken: tokenRef.current }
//       );
//       const newToken = response.data.accessToken;
//       setToken(newToken);
//       tokenRef.current = newToken;
//       localStorage.setItem("authToken", newToken);
//       fetchCenters(newToken);
//     } catch (error) {
//       setError("Failed to refresh token. Please log in again.");
//     }
//   };

//   const fetchCenters = async (authToken = tokenRef.current) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       setCenters(response.data.data || []);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         await refreshAuthToken();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCenter = async () => {
//     if (
//       !newCenter.name.trim() ||
//       !newCenter.address.trim() ||
//       !newCenter.phone.trim()
//     ) {
//       setError("Iltimos, barcha maydonlarni to'ldiring.");
//       return;
//     }

//     const centerData = {
//       name: newCenter.name,
//       regionId: newCenter.regionId || 1,
//       address: newCenter.address,
//       image: newCenter.image || "default.jpg",
//       majorsId: newCenter.majorsId?.length ? newCenter.majorsId : [1],
//       phone: newCenter.phone,
//     };

//     try {
//       const response = await axios.post(API_URL, centerData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Markaz qo'shildi:", response.data);
//       setCenters([...centers, response.data]);

//       // Reset form
//       setNewCenter({
//         name: "",
//         address: "",
//         phone: "",
//         regionId: 1,
//         majorsId: [],
//         image: "",
//       });
//     } catch (error) {
//       console.error(
//         "Markaz qo'shishda xatolik:",
//         error.response?.data || error
//       );
//       setError(error.response?.data?.message || "Markaz qo'shib bo'lmadi.");
//     }
//   };

//   const handleDeleteCenter = async (centerId) => {
//     try {
//       await axios.delete(`${API_URL}/${centerId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCenters(centers.filter((center) => center.id !== centerId));
//     } catch (error) {
//       setError("Failed to delete center.");
//     }
//   };

//   useEffect(() => {
//     fetchCenters();
//     const tokenInterval = setInterval(refreshAuthToken, 15 * 60 * 1000);
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
//                   <td className="border-b p-4 text-right space-x-2">
//                     <IconButton
//                       color="red"
//                       onClick={() => handleDeleteCenter(center.id)}
//                     >
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
