import React, { useState } from "react";
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
const fetchReceptions = async (userRole, userId) => {
  const token = await useAuthStore.getState().refreshTokenFunc();
  if (!token) throw new Error("Not authenticated");

  // Only admin and superadmin can fetch all receptions
  if (userRole !== "admin" && userRole !== "superadmin") {
    throw new Error("Unauthorized access");
  }

  const response = await fetch("https://findcourse.net.uz/api/reseption", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch receptions");
  }

  return response.json();
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
    userRole !== "admin" &&
    userRole !== "superadmin" &&
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

  // Queries
  const {
    data: receptions = [],
    isLoading: isLoadingReceptions,
    error: errorReceptions,
    refetch: refetchReceptions,
  } = useQuery({
    queryKey: ["receptions"],
    queryFn: () => fetchReceptions(user?.role, user?.id),
    enabled: user?.role === "admin" || user?.role === "superadmin",
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateReceptionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receptions"] });
      setOpenEditDialog(false);
      toast.success("Reception status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteReceptionMutation = useMutation({
    mutationFn: (id) => deleteReception(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receptions"] });
      setOpenDeleteDialog(false);
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
        user?.id
      );
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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
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
              {(user?.role === "admin" || user?.role === "superadmin") && (
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
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <Icons.FaUserCheck size={24} className="text-gray-600 dark:text-gray-300" />
              </div>
              <Typography variant="h6" className="font-medium text-center">
                {reception.name || "No Name"}
              </Typography>
              <Badge
                color={getStatusColor(reception.status)}
                className="mt-2"
                content={reception.status}
              >
                <Typography variant="small" className="text-white px-2 py-1 rounded-full">
                  {reception.status}
                </Typography>
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    );
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
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedReception.status)} text-white`}>
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
              <Option value="APPROVED">APPROVED</Option>
              <Option value="REJECTED">REJECTED</Option>
              <Option value="COMPLETED">COMPLETED</Option>
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