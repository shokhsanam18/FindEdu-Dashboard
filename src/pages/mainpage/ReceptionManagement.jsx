import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
  IconButton,
  Tooltip,
  Spinner,
  Badge,
} from "@material-tailwind/react";
import { useAuthStore } from "../../Store";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import * as Icons from "react-icons/fa";
import { toast } from "react-toastify";

const queryClient = new QueryClient();

export const Title = ({ children }) => (
  <Typography
    variant="h4"
    style={{ color: "#007BFF" }}
    className="uppercase font-bold mb-4"
  >
    {children}
  </Typography>
);

// API functions
const fetchReceptions = async (userRole, userId, take = 100000, page = 1) => {
  const token = await useAuthStore.getState().refreshTokenFunc();
  if (!token) throw new Error("Not authenticated");

  if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
    throw new Error("Unauthorized access");
  }

  // ⬇️ ADD THIS DEBUG LOGGING HERE
  // console.log("🔍 Fetching receptions with role:", userRole, "userId:", userId);

  const response = await fetch(
    `https://findcourse.net.uz/api/reseption?take=${take}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json(); // ⬅️ Move this up before checking .ok for logging
  // console.log("🧪 Raw reception API response:", result);

  if (!response.ok) {
    const errorData = result;
    throw new Error(errorData.message || "Failed to fetch receptions");
  }

  return result.data || [];
};

const fetchSingleReception = async (id, userRole, userId) => {
  const token = await useAuthStore.getState().refreshTokenFunc();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`https://findcourse.net.uz/api/reseption/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch reception");
  }

  const reception = await response.json();

  // Check if user is owner or has admin privileges
  if (
    userRole !== "ADMIN" &&
    userRole !== "SUPERADMIN" &&
    reception.userId !== userId
  ) {
    throw new Error("Unauthorized access");
  }

  return reception;
};

const updateReceptionStatus = async (id, status) => {
  const token = await useAuthStore.getState().refreshTokenFunc();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`https://findcourse.net.uz/api/reseption/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update reception");
  }

  return response.json();
};

const deleteReception = async (id) => {
  const token = await useAuthStore.getState().refreshTokenFunc();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`https://findcourse.net.uz/api/reseption/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete reception");
  }

  return response.json();
};

const ReceptionManagement = () => {
  const { user } = useAuthStore();
  const [selectedReception, setSelectedReception] = useState(null);
  const [openReceptionDialog, setOpenReceptionDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [receptionToDelete, setReceptionToDelete] = useState(null);
  const [status, setStatus] = useState("PENDING");
  // console.log("user", user)

  const [enabledQuery, setEnabledQuery] = useState(false);

  // const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
      setEnabledQuery(true);
    }
  }, [user]);


  // Queries
  const {
    data: receptions = [],
    isLoading: isLoadingReceptions,
    error: errorReceptions,
    refetch: refetchReceptions,
  } = useQuery({
    queryKey: ["receptions"],
    queryFn: () => fetchReceptions(user?.role, user?.data?.id),
    enabled: enabledQuery,
  });


  useEffect(() => {
    // console.log("Receptions fetched:", center);
  }, [receptions]);


  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateReceptionStatus(id, status),
    onSuccess: () => {
      setOpenEditDialog(false);
      refetchReceptions(); // ⬅️ force re-fetch
      toast.success("Reception status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteReceptionMutation = useMutation({
    mutationFn: (id) => deleteReception(id),
    onSuccess: () => {
      setOpenDeleteDialog(false);
      refetchReceptions(); // ⬅️ force re-fetch
      toast.success("Reception deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Handlers
  const handleOpenReception = async (reception) => {
    try {
      const receptionData = await fetchSingleReception(
        reception.id,
        user?.role,
        user?.data?.id
      );
      
      // console.log("📦 Full receptionData:", receptionData);
      // console.log("🎯 centerId from receptionData:", receptionData.centerId);
  
      // ⬇️ Fetch full center info
      if (receptionData.centerId) {
        const center = await fetchCenterById(receptionData.centerId);
        receptionData.center = center; // patch it into the object
      }

      // console.log("🔎 Reception Data:", receptionData);
  
      setSelectedReception(receptionData);
      setOpenReceptionDialog(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOpenEdit = (reception) => {
    setSelectedReception(reception);
    setStatus(reception.status);
    setOpenEditDialog(true);
  };

  const handleOpenDelete = (reception) => {
    setReceptionToDelete(reception);
    setOpenDeleteDialog(true);
  };

  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({
      id: selectedReception.id,
      status,
    });
  };

  const handleDeleteReception = () => {
    deleteReceptionMutation.mutate(receptionToDelete.id);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "PENDING":
        return "amber";
      case "VISIT":
        return "green";
      case "NOT VISIT":
        return "red";
      default:
        return "gray";
    }
  };

  const renderReceptionCards = () => {
    if (isLoadingReceptions) return <Spinner className="h-8 w-8" />;
    if (errorReceptions)
      return <p className="text-red-500">Error: {errorReceptions.message}</p>;

    if (receptions.length === 0)
      return (
        <Typography variant="paragraph" className="text-gray-600">
          No receptions found
        </Typography>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {receptions.map((reception) => (
          <Card
            key={reception.id}
            shadow={true}
            className="relative bg-white dark:bg-gray-800 p-6 h-48 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                <>
                  <Tooltip content="Edit">
                    <IconButton
                      color="blue"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(reception);
                      }}
                    >
                      <Icons.FaEdit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <IconButton
                      color="red"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDelete(reception);
                      }}
                    >
                      <Icons.FaTrash size={16} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </div>

            <div
              className="flex flex-col items-center justify-center h-full"
              onClick={() => handleOpenReception(reception)}
            >
              <img
                src={
                  reception.user?.image
                    ? `https://findcourse.net.uz/api/image/${reception.user.image}`
                    : "https://via.placeholder.com/80"
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover mb-3"
              />

              <Typography variant="h6" className="font-medium text-center">
                {`${reception.user?.firstName || ""} ${reception.user?.lastName || ""}`}
              </Typography>

              <Badge
                color={getBadgeColor(reception.status)}
                className="mt-4 px-3"
                content={reception.status}
              >
                <Typography
                  variant="small"
                  className="text-white px-2 py-1 rounded-full"
                >
                  {reception.status}
                </Typography>
              </Badge>

            </div>
          </Card>
        ))}
      </div>
    );
  };


  const fetchCenterById = async (centerId) => {
    // console.log("📡 Fetching center ID:", centerId); // 👈 this line
    const token = await useAuthStore.getState().refreshTokenFunc();
    if (!token) {
      console.warn("🚫 No token available");
      return null;
    }
  
    const response = await fetch(`https://findcourse.net.uz/api/centers/${centerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const responseData = await response.json();
  
    if (!response.ok) {
      console.warn("❌ Failed to fetch center:", responseData);
      return null;
    }
  
    // console.log("✅ Center data:", responseData?.data);
    return responseData.data;
  };
  return (
    <div className="overflow-x-hidden bg-gray-100 dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <Title>Reception Management</Title>
      </div>

      {renderReceptionCards()}

      {/* Reception Details Dialog */}
      <Dialog
        open={openReceptionDialog}
        handler={() => setOpenReceptionDialog(false)}
        size="lg"
      >
        <DialogHeader>Reception Details</DialogHeader>
        <DialogBody>
          {selectedReception ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="h6" className="font-bold mb-2">
                  Basic Information
                </Typography>
                <div className="space-y-2">
                  <Typography variant="paragraph">
                    <span className="font-semibold">ID:</span> {selectedReception.id}
                  </Typography>
                  <Typography variant="paragraph">
                    <span className="font-semibold">Name:</span> {selectedReception.name || "N/A"}
                  </Typography>
                  <Typography variant="paragraph">
                    <span className="font-semibold">Email:</span> {selectedReception.email || "N/A"}
                  </Typography>
                  <Typography variant="paragraph">
                    <span className="font-semibold">Phone:</span> {selectedReception.phone || "N/A"}
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h6" className="font-bold mb-2">
                  Status Information
                </Typography>
                <div className="space-y-2">
                  <Typography variant="paragraph">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={`px-2 py-1 rounded-full ${getBadgeColor(selectedReception.status)} text-white`}>
                      {selectedReception.status}
                    </span>
                  </Typography>
                  <Typography variant="paragraph">
                    <span className="font-semibold">Created At:</span>{" "}
                    {new Date(selectedReception.createdAt).toLocaleString() || "N/A"}
                  </Typography>
                  <Typography variant="paragraph">
                    <span className="font-semibold">Updated At:</span>{" "}
                    {new Date(selectedReception.updatedAt).toLocaleString() || "N/A"}
                  </Typography>
                </div>
              </div>
              {selectedReception.notes && (
                <div className="col-span-2">
                  <Typography variant="h6" className="font-bold mb-2">
                    Notes
                  </Typography>
                  <Typography variant="paragraph" className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                    {selectedReception.notes}
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <Spinner className="h-8 w-8" />
          )}
        </DialogBody>

        <div className="col-span-2 mt-6">
          <Typography variant="h6" className="font-bold mb-2">
            Center Information
          </Typography>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Typography variant="paragraph">
                <span className="font-semibold">Center Name:</span> {selectedReception?.center?.name || "N/A"}
              </Typography>
              <Typography variant="paragraph">
                <span className="font-semibold">Major:</span> {selectedReception?.major?.name || "N/A"}
              </Typography>
              <Typography variant="paragraph">
                <span className="font-semibold">Filial Address:</span> {selectedReception?.filial?.address || "N/A"}
              </Typography>
              <Typography variant="paragraph">
                <span className="font-semibold">Region:</span>{" "}
                {selectedReception?.filial?.region?.name || selectedReception?.filial?.regionId || "N/A"}
              </Typography>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={
                  selectedReception?.filial?.image
                    ? `https://findcourse.net.uz/api/image/${selectedReception.filial.image}`
                    : "/placeholder-image.jpg"
                }
                alt="Filial"
                className="w-full max-w-[300px] h-40 object-cover rounded-lg shadow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            color="blue"
            onClick={() => setOpenReceptionDialog(false)}
            className="mr-2"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog
        open={openEditDialog}
        handler={() => setOpenEditDialog(false)}
        size="sm"
      >
        <DialogHeader>Update Reception Status</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Select
              label="Status"
              value={status}
              onChange={(value) => setStatus(value)}
            >
              <Option value="PENDING">PENDING</Option>
              <Option value="VISIT">VISIT</Option>
              <Option value="NOT VISIT">NOT VISIT</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenEditDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleUpdateStatus}
            disabled={updateStatusMutation.isLoading}
          >
            {updateStatusMutation.isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
        size="sm"
      >
        <DialogHeader>Delete Reception</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" className="text-red-500">
            Are you sure you want to delete the reception{" "}
            {receptionToDelete?.name ? `"${receptionToDelete.name}"` : ""}? This action cannot be
            undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteReception}
            disabled={deleteReceptionMutation.isLoading}
          >
            {deleteReceptionMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ReceptionManagement;