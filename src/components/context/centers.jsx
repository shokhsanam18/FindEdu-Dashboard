// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardBody,
//   Typography,
//   Spinner,
//   IconButton,
//   Popover,
//   PopoverHandler,
//   PopoverContent,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Button,
//   Input,
// } from "@material-tailwind/react";
// import { TrashIcon, PencilIcon as Edit } from "@heroicons/react/24/solid";
// import { useCenterStore, useAuthStore } from "../../Store";
// import { toast } from "sonner";
// import axios from "axios";

// const CentersManagement = () => {
//   const [selectedCenter, setSelectedCenter] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     image: "",
//   });

//   const handleEdit = (center) => {
//     setSelectedCenter(center);
//     setFormData({
//       name: center.name,
//       address: center.address,
//       phone: center.phone,
//       image: center.image,
//     });
//     setIsModalOpen(true);
//   };

//   const updateCenter = async (centerData) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         console.error("Token not found!");
//         return;
//       }
//       const payload = {
//         name: centerData.name,
//         address: centerData.address,
//         phone: centerData.phone,
//         image: centerData.image,
//       };

//       await axios.patch(
//         `https://findcourse.net.uz/api/centers/${selectedCenter.id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchCenters();
//       toast.success("Center updated successfully");
//     } catch (err) {
//       console.error("Update failed", err);
//       toast.error("Failed to update center");
//     }
//   };

//   const handleSave = () => {
//     updateCenter(formData);
//     setIsModalOpen(false);
//   };

//   const { centers, fetchCenters, deleteCenter, loading, error } =
//     useCenterStore();
//   const { refreshTokenFunc } = useAuthStore();
//   const [deletingIds, setDeletingIds] = useState([]);

//   useEffect(() => {
//     fetchCenters();
//     const tokenInterval = setInterval(() => {
//       refreshTokenFunc();
//     }, 15 * 60 * 1000);
//     return () => clearInterval(tokenInterval);
//   }, [fetchCenters, refreshTokenFunc]);

//   const handleDelete = async (id) => {
//     setDeletingIds((prev) => [...prev, id]);
//     try {
//       const success = await deleteCenter(id);
//       if (success) {
//         toast.success("Center deleted successfully");
//       } else {
//         toast.error("Failed to delete center");
//       }
//     } catch (err) {
//       toast.error("An error occurred while deleting");
//       console.error("Delete error:", err);
//     } finally {
//       setDeletingIds((prev) => prev.filter((item) => item !== id));
//     }
//   };

//   const renderCellWithPopover = (text) => (
//     <Popover placement="bottom-start">
//       <PopoverHandler>
//         <Typography className="truncate w-full max-w-[150px] cursor-pointer inline-block">
//           {text || "N/A"}
//         </Typography>
//       </PopoverHandler>
//       <PopoverContent>{text || "N/A"}</PopoverContent>
//     </Popover>
//   );

//   return (
//     <Card className="mt-6 p-4 overflow-hidden">
//       <Typography variant="h4" color="blue-gray">
//         O'quv Markazlari
//       </Typography>
//       {error && <Typography color="red">{error}</Typography>}
//       <CardBody className="overflow-auto p-0">
//         {loading ? (
//           <Spinner className="mx-auto my-10" />
//         ) : (
//           <table className="w-full min-w-max table-auto text-left">
//             <thead>
//               <tr>
//                 <th className="border-b p-4">Nomi</th>
//                 <th className="border-b p-4">Joylashuvi</th>
//                 <th className="border-b p-4">Raqami</th>
//                 <th className="border-b p-4">Viloyat</th>
//                 <th className="border-b p-4">Yo'nalishi</th>
//                 <th className="border-b p-4">Bajarish</th>
//               </tr>
//             </thead>
//             <tbody>
//               {centers.map((center) => (
//                 <tr key={center.id}>
//                   <td className="border-b p-4 text-black">
//                     {renderCellWithPopover(center.name)}
//                   </td>
//                   <td className="border-b p-4 w-[100px]">
//                     {renderCellWithPopover(center.address)}
//                   </td>
//                   <td className="border-b p-4">
//                     {renderCellWithPopover(center.phone)}
//                   </td>
//                   <td className="border-b p-4">
//                     {renderCellWithPopover(center.regionId)}
//                   </td>
//                   <td className="border-b p-4">
//                     {renderCellWithPopover(center.majorsId)}
//                   </td>
//                   <td className="border-b p-4 flex gap-5">
//                     <IconButton
//                       color="amber"
//                       className="hover:shadow-md hover:shadow-yellow-600"
//                       onClick={() => handleEdit(center)}
//                     >
//                       <Edit className="h-5 w-5" />
//                     </IconButton>
//                     <IconButton
//                       color="red"
//                       onClick={() => handleDelete(center.id)}
//                       disabled={deletingIds.includes(center.id)}
//                     >
//                       {deletingIds.includes(center.id) ? (
//                         <Spinner className="h-5 w-5" />
//                       ) : (
//                         <TrashIcon className="h-5 w-5" />
//                       )}
//                     </IconButton>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </CardBody>

//       <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)}>
//         <DialogHeader>Edit Center</DialogHeader>
//         <DialogBody divider>
//           <div className="grid gap-4">
//             <Input
//               label="Name"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//             <Input
//               label="Address"
//               value={formData.address}
//               onChange={(e) => setFormData({...formData, address: e.target.value})}
//             />
//             <Input
//               label="Phone"
//               value={formData.phone}
//               onChange={(e) => setFormData({...formData, phone: e.target.value})}
//             />
//             <Input
//               label="Image URL"
//               value={formData.image}
//               onChange={(e) => setFormData({...formData, image: e.target.value})}
//             />
//           </div>
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             variant="text"
//             color="red"
//             onClick={() => setIsModalOpen(false)}
//             className="mr-1"
//           >
//             <span>Cancel</span>
//           </Button>
//           <Button variant="gradient" color="green" onClick={handleSave}>
//             <span>Save</span>
//           </Button>
//         </DialogFooter>
//       </Dialog>
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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Avatar,
  Select,
  Option,
} from "@material-tailwind/react";
import { 
  TrashIcon, 
  PencilIcon as Edit,
  PlusIcon,
  MapPinIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/solid";
import { useCenterStore, useAuthStore, useCardStore } from "../../Store";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://findcourse.net.uz/api";
const ImageApi = `${API_BASE}/image`;

const CentersManagement = () => {
  const navigate = useNavigate();
  const { regions, fetchData } = useCardStore();
  const { centers, fetchCenters, deleteCenter, loading, error } = useCenterStore();
  const { refreshTokenFunc } = useAuthStore();
  
  const [deletingIds, setDeletingIds] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [branches, setBranches] = useState([]);
  const [mainBranch, setMainBranch] = useState(null);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [originalBranch, setOriginalBranch] = useState(null);
  const [branchFormData, setBranchFormData] = useState({
    name: "",
    phone: "",
    address: "",
    regionId: "",
    image: null,
  });
  const [branchPreviewUrl, setBranchPreviewUrl] = useState(null);
  const [branchImageFile, setBranchImageFile] = useState(null);
  const [isManualBranchName, setIsManualBranchName] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  useEffect(() => {
    fetchCenters();
    fetchData();
    const tokenInterval = setInterval(() => {
      refreshTokenFunc();
    }, 15 * 60 * 1000);
    return () => clearInterval(tokenInterval);
  }, [fetchCenters, fetchData, refreshTokenFunc]);

  const handleDelete = async (id) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      const success = await deleteCenter(id);
      if (success) {
        toast.success("Center deleted successfully");
      } else {
        toast.error("Failed to delete center");
      }
    } catch (err) {
      toast.error("An error occurred while deleting");
      console.error("Delete error:", err);
    } finally {
      setDeletingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleEdit = async (center) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      
      const centerRes = await axios.get(`${API_BASE}/centers/${center.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const centerData = centerRes.data?.data;

      const branchesRes = await axios.get(`${API_BASE}/filials`, {
        params: { centerId: center.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const filials = branchesRes.data?.data || [];
      const main = filials.find(f => f.name?.toLowerCase().includes("main"));
      const others = filials.filter(f => !f.name?.toLowerCase().includes("main"));

      setSelectedCenter(centerData);
      setMainBranch(main || null);
      setBranches(others);
      
      setFormData({
        name: centerData.name || "",
        address: centerData.address || "",
        phone: centerData.phone || "",
        image: centerData.image || null,
      });

      if (centerData.image) {
        setPreviewUrl(`${ImageApi}/${centerData.image}`);
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching center details:", err);
      toast.error("Failed to load center details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const updateCenter = async () => {
    setIsSubmitting(true);
    let uploadedImageFilename = null;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must be logged in to update a center.");
        setIsSubmitting(false);
        return;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        uploadedImageFilename = uploadRes.data?.data;
      }

      const payload = {};
      if (formData.name.trimEnd() !== selectedCenter.name.trim()) {
        payload.name = formData.name.trimEnd();
      }
      if (formData.phone.replace(/\s+/g, '') !== selectedCenter.phone.replace(/\s+/g, '')) {
        payload.phone = formData.phone.replace(/\s+/g, '');
      }
      if (formData.address.trimEnd() !== selectedCenter.address.trim()) {
        payload.address = formData.address.trimEnd();
      }
      if (uploadedImageFilename) payload.image = uploadedImageFilename;

      if (Object.keys(payload).length > 0) {
        await axios.patch(`${API_BASE}/centers/${selectedCenter.id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Center updated successfully!");

        if (mainBranch?.id) {
          const branchPayload = {};
          const expectedName = `${formData.name} - ${selectedCenter?.region?.name} Main branch`;

          if (expectedName !== mainBranch.name) {
            branchPayload.name = expectedName;
          }

          if (formData.phone !== mainBranch.phone) {
            branchPayload.phone = formData.phone;
          }

          if (formData.address !== mainBranch.address) {
            branchPayload.address = formData.address;
          }

          if (uploadedImageFilename) {
            branchPayload.image = uploadedImageFilename;
          }

          if (Object.keys(branchPayload).length > 0) {
            await axios.patch(`${API_BASE}/filials/${mainBranch.id}`, branchPayload, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
          }
        }
      } else {
        toast.info("No changes detected.");
      }

      fetchCenters();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating center:", err);
      let errorMessage = "Failed to update center.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBranchImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    setBranchImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBranchPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBranchChange = (e) => {
    const { name, value } = e.target;

    setBranchFormData((prev) => {
      const updated = {
        ...prev,
        [name]: name === "regionId" ? Number(value) : value,
      };

      if (name === "regionId" && !isManualBranchName) {
        const regionName = regions.find(r => r.id === Number(value))?.name || "";
        updated.name = regionName ? `${formData.name} - ${regionName} branch` : `${formData.name} branch`;
      }

      return updated;
    });
  };

  const handleNewBranchClick = () => {
    const defaultRegionId = regions.length > 0 ? regions[0].id : "";
    const defaultRegionName = regions.find(r => r.id === defaultRegionId)?.name || "";

    const autoName = !isManualBranchName && formData.name
      ? defaultRegionName
        ? `${formData.name} - ${defaultRegionName} branch`
        : `${formData.name} branch`
      : "";

    setShowBranchForm(true);
    setEditingBranchId(null);
    setBranchFormData({
      name: autoName,
      phone: "",
      address: "",
      image: null,
      regionId: defaultRegionId,
    });
    setBranchPreviewUrl(null);
    setBranchImageFile(null);
  };

  const handleEditBranchClick = (branch) => {
    setShowBranchForm(true);
    setEditingBranchId(branch.id);
    setOriginalBranch(branch);

    setBranchFormData({
      name: branch.name || "",
      phone: branch.phone || "",
      address: branch.address || "",
      regionId: branch.regionId || (regions.length > 0 ? regions[0].id : ""),
      image: branch.image || null
    });

    setBranchPreviewUrl(branch.image ? `${ImageApi}/${branch.image}` : null);
    setBranchImageFile(null);
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let uploadedImageFilename = null;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must be logged in to manage branches.");
        setIsSubmitting(false);
        return;
      }

      if (branchImageFile) {
        const formData = new FormData();
        formData.append("image", branchImageFile);

        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        uploadedImageFilename = uploadRes.data?.data;
      }

      const branchData = {};

      if (!editingBranchId || branchFormData.name.trimEnd() !== originalBranch?.name?.trim()) {
        branchData.name = branchFormData.name.trimEnd();
      }
      if (!editingBranchId || branchFormData.phone.replace(/\s+/g, '') !== originalBranch?.phone?.replace(/\s+/g, '')) {
        branchData.phone = branchFormData.phone.replace(/\s+/g, '');
      }
      if (!editingBranchId || branchFormData.address.trimEnd() !== originalBranch?.address?.trim()) {
        branchData.address = branchFormData.address.trimEnd();
      }
      if (uploadedImageFilename) {
        branchData.image = uploadedImageFilename;
      }

      if (editingBranchId && Object.keys(branchData).length === 0) {
        toast.info("No changes detected.");
        setIsSubmitting(false);
        return;
      }

      if (editingBranchId) {
        await axios.patch(`${API_BASE}/filials/${editingBranchId}`, branchData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Branch updated successfully!");
      } else {
        await axios.post(`${API_BASE}/filials`, {
          ...branchData,
          centerId: Number(selectedCenter.id),
          regionId: branchFormData.regionId,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Branch created successfully!");
      }

      // Refresh branches
      const branchesRes = await axios.get(`${API_BASE}/filials`, {
        params: { centerId: selectedCenter.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const filials = branchesRes.data?.data || [];
      const main = filials.find(f => f.name?.toLowerCase().includes("main"));
      const others = filials.filter(f => !f.name?.toLowerCase().includes("main"));

      setMainBranch(main || null);
      setBranches(others);
      setShowBranchForm(false);
      setEditingBranchId(null);

    } catch (err) {
      console.error("Error managing branch:", err);
      let errorMessage = editingBranchId
        ? "Failed to update branch."
        : "Failed to create branch.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized - Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 404) {
          errorMessage = "Learning center not found.";
        } else if (err.response.status === 422) {
          errorMessage = "Validation error. Please check your inputs.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = (branchId) => {
    setBranchToDelete(branchId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteBranch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must be logged in to delete a branch.");
        return;
      }

      await axios.delete(`${API_BASE}/filials/${branchToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Branch deleted successfully!");
      setOpenDeleteDialog(false);
      setBranchToDelete(null);

      // Refresh branches
      const branchesRes = await axios.get(`${API_BASE}/filials`, {
        params: { centerId: selectedCenter.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const filials = branchesRes.data?.data || [];
      const main = filials.find(f => f.name?.toLowerCase().includes("main"));
      const others = filials.filter(f => !f.name?.toLowerCase().includes("main"));

      setMainBranch(main || null);
      setBranches(others);

    } catch (err) {
      console.error("Error deleting branch:", err);
      toast.error("Failed to delete branch.");
      setOpenDeleteDialog(false);
    }
  };

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
    <>
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
                    <td className="border-b p-4 flex gap-5">
                      <IconButton
                        color="amber"
                        className="hover:shadow-md hover:shadow-yellow-600"
                        onClick={() => handleEdit(center)}
                      >
                        <Edit className="h-5 w-5" />
                      </IconButton>
                      <IconButton
                        color="red"
                        onClick={() => handleDelete(center.id)}
                        disabled={deletingIds.includes(center.id)}
                      >
                        {deletingIds.includes(center.id) ? (
                          <Spinner className="h-5 w-5" />
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
      <Dialog 
        open={isModalOpen} 
        handler={() => setIsModalOpen(false)}
        size="xl"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsModalOpen(false)}>
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <span>Tahrirlash: {selectedCenter?.name}</span>
          </div>
        </DialogHeader>
        <DialogBody divider className="max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-300">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={selectedCenter?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gray-200 flex items-center justify-center">
                    <MapPinIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md cursor-pointer">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomi</label>
                  <Input
                    label="Nomi"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                  <Input
                    label="Manzil"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <Input
                    label="Telefon"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  fullWidth
                  color="green"
                  onClick={updateCenter}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Saqlanmoqda...
                    </span>
                  ) : (
                    "Saqlash"
                  )}
                </Button>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h5">Filiallar</Typography>
                <Button
                  onClick={handleNewBranchClick}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Yangi filial
                </Button>
              </div>

              {showBranchForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <Typography variant="h6" className="mb-4">
                    {editingBranchId ? "Filialni tahrirlash" : "Yangi filial"}
                  </Typography>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filial nomi</label>
                        <Input
                          type="text"
                          name="name"
                          value={branchFormData.name}
                          onChange={handleBranchChange}
                          readOnly={!isManualBranchName}
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="manualBranchEdit"
                            checked={isManualBranchName}
                            onChange={() => setIsManualBranchName(prev => !prev)}
                          />
                          <label htmlFor="manualBranchEdit" className="text-sm text-gray-600">
                            Qo'lda nom kiritish
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={branchFormData.phone}
                          onChange={handleBranchChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Viloyat</label>
                        <Select
                          name="regionId"
                          value={branchFormData.regionId?.toString()}
                          onChange={(value) => handleBranchChange({ 
                            target: { name: "regionId", value } 
                          })}
                        >
                          {regions.map(region => (
                            <Option key={region.id} value={region.id.toString()}>
                              {region.name}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                        <Input
                          type="text"
                          name="address"
                          value={branchFormData.address}
                          onChange={handleBranchChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rasm</label>
                      <div className="flex items-center space-x-4">
                        {branchPreviewUrl && (
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img
                              src={branchPreviewUrl}
                              alt="Branch preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            onChange={handleBranchImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                          <Button variant="outlined" size="sm">
                            {branchPreviewUrl ? "Rasmni o'zgartirish" : "Rasm yuklash"}
                          </Button>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="text"
                        color="red"
                        onClick={() => setShowBranchForm(false)}
                      >
                        Bekor qilish
                      </Button>
                      <Button
                        color="green"
                        onClick={handleBranchSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Spinner className="h-4 w-4" />
                            {editingBranchId ? "Saqlanmoqda..." : "Yaratilmoqda..."}
                          </span>
                        ) : (
                          editingBranchId ? "Saqlash" : "Yaratish"
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {branches.length === 0 ? (
                <div className="text-center py-8">
                  <Typography color="gray">Filiallar mavjud emas</Typography>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map((branch) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Typography variant="h6" className="font-semibold">
                            {branch.name}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {branch.address}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {branch.phone}
                          </Typography>
                        </div>
                        <div className="flex gap-2">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => handleEditBranchClick(branch)}
                          >
                            <Edit className="h-5 w-5" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => handleDeleteBranch(branch.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </div>
                      </div>
                      {branch.image && (
                        <div className="mt-3 w-full h-40 rounded-md overflow-hidden">
                          <img
                    src={`${ImageApi}/${branch.image}`}
                            alt={branch.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogBody>
      </Dialog>

      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Filialni o'chirish</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Haqiqatan ham bu filialni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Bekor qilish
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmDeleteBranch}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            O'chirish
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CentersManagement;