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
  IconButton,
  Tooltip,
  Spinner,
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

const fetchRegions = async () => {
  const response = await fetch("https://findcourse.net.uz/api/regions/search");
  if (!response.ok) throw new Error("Failed to fetch regions");
  const data = await response.json();
  return data.data || [];
};

const RegionsManagement = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [openRegionDialog, setOpenRegionDialog] = useState(false);
  const [openCreateRegionDialog, setOpenCreateRegionDialog] = useState(false);
  const [openEditRegionDialog, setOpenEditRegionDialog] = useState(false);
  const [openDeleteRegionDialog, setOpenDeleteRegionDialog] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState(null);
  const [newRegion, setNewRegion] = useState({ name: "" });
  const [editingRegion, setEditingRegion] = useState({ id: "", name: "" });

  const {
    data: regions = [],
    isLoading: isLoadingRegions,
    error: errorRegions,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const createRegionMutation = useMutation({
    mutationFn: async (regionData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("https://findcourse.net.uz/api/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(regionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create region");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      setOpenCreateRegionDialog(false);
      setNewRegion({ name: "" });
      toast.success("Region created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateRegionMutation = useMutation({
    mutationFn: async (regionData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`https://findcourse.net.uz/api/regions/${regionData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: regionData.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update region");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      setOpenEditRegionDialog(false);
      toast.success("Region updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteRegionMutation = useMutation({
    mutationFn: async (regionId) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`https://findcourse.net.uz/api/regions/${regionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete region");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      setOpenDeleteRegionDialog(false);
      toast.success("Region deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOpenRegion = (region) => {
    setSelectedRegion(region);
    setOpenRegionDialog(true);
  };

  const handleCreateRegion = () => {
    createRegionMutation.mutate(newRegion);
  };

  const handleUpdateRegion = () => {
    updateRegionMutation.mutate(editingRegion);
  };

  const handleDeleteRegion = () => {
    deleteRegionMutation.mutate(regionToDelete.id);
  };

  const handleEditRegion = (region) => {
    setEditingRegion({
      id: region.id,
      name: region.name,
    });
    setOpenEditRegionDialog(true);
  };

  const handleRegionInputChange = (e) => {
    const { name, value } = e.target;
    setNewRegion((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRegionInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRegion((prev) => ({ ...prev, [name]: value }));
  };

  const renderRegionCards = () => {
    if (isLoadingRegions) return <Spinner className="h-8 w-8" />;
    if (errorRegions) return <p className="text-red-500">Error: {errorRegions.message}</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card
          shadow={true}
          className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center p-6 h-48 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          onClick={() => setOpenCreateRegionDialog(true)}
        >
          <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
            <Icons.FaPlus size={40} />
          </div>
          <Typography variant="h6" className="mt-2 font-medium text-center">
            Add New Region
          </Typography>
        </Card>

        {regions.map((region) => (
          <Card
            key={region.id}
            shadow={true}
            className="relative bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white p-6 h-48 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <Tooltip content="Edit">
                <IconButton
                  color="blue"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRegion(region);
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
                    setRegionToDelete(region);
                    setOpenDeleteRegionDialog(true);
                  }}
                >
                  <Icons.FaTrash size={16} />
                </IconButton>
              </Tooltip>
            </div>
            
            <div 
              className="flex flex-col items-center justify-center h-full"
              onClick={() => handleOpenRegion(region)}
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <Icons.FaMapMarkerAlt size={24} />
              </div>
              <Typography variant="h6" className="font-medium text-center">
                {region.name}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden bg-gray-900 dark:bg-gray-900">
      <div className="w-full px-6 py-6 bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <Title>Regions</Title>
        </div>
        {renderRegionCards()}
      </div>

      {/* Region Dialogs */}
      <Dialog
        open={openRegionDialog}
        handler={() => setOpenRegionDialog(false)}
        className="bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg p-4 text-white transition-all duration-500"
      >
        <DialogHeader className="bg-transparent text-white text-xl font-semibold p-4 rounded-t-lg">
          {selectedRegion?.name}
        </DialogHeader>
        <DialogBody className="bg-transparent p-4 rounded-b-lg">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Icons.FaMapMarkerAlt size={48} />
            </div>
            <Typography variant="paragraph" className="text-center">
              Region ID: {selectedRegion?.id}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter className="bg-transparent p-4 rounded-b-lg">
          <Button
            color="blue"
            onClick={() => setOpenRegionDialog(false)}
            className="bg-white text-blue-500 hover:bg-gray-100 transition-colors duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openCreateRegionDialog}
        handler={() => setOpenCreateRegionDialog(false)}
        size="sm"
      >
        <DialogHeader>Create New Region</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Region Name"
              name="name"
              value={newRegion.name}
              onChange={handleRegionInputChange}
              required
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenCreateRegionDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleCreateRegion}
            disabled={!newRegion.name || createRegionMutation.isLoading}
          >
            {createRegionMutation.isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openEditRegionDialog}
        handler={() => setOpenEditRegionDialog(false)}
        size="sm"
      >
        <DialogHeader>Edit Region</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Region Name"
              name="name"
              value={editingRegion.name}
              onChange={handleEditRegionInputChange}
              required
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenEditRegionDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleUpdateRegion}
            disabled={!editingRegion.name || updateRegionMutation.isLoading}
          >
            {updateRegionMutation.isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openDeleteRegionDialog}
        handler={() => setOpenDeleteRegionDialog(false)}
        size="sm"
      >
        <DialogHeader>Delete Region</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" className="text-red-500">
            Are you sure you want to delete the region "{regionToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteRegionDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteRegion}
            disabled={deleteRegionMutation.isLoading}
          >
            {deleteRegionMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default RegionsManagement;