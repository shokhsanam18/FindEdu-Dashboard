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
} from "@material-tailwind/react";
import { useAuthStore } from "../../Store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
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

const fetchMajors = async () => {
  const response = await fetch("https://findcourse.net.uz/api/major");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  const data = await response.json();

  const dataForSave = data.data.map((major) => ({
    id: major.id,
    name: major.name,
    description: major.description || "No description available",
    centers: major.centers || [],
    link: "/",
    fieldId: major.fieldId,
    image: major.image
  }));
  localStorage.setItem("majors", JSON.stringify(dataForSave));

  return data.data || [];
};

const fetchFields = async () => {
  const response = await fetch("https://findcourse.net.uz/api/fields");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  const data = await response.json();
  localStorage.setItem("fields", JSON.stringify(data.data));
  return data.data || [];
};

const getIconForField = (name) => {
  const iconList = Object.values(Icons);
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return React.createElement(iconList[hash % iconList.length], { size: 40 });
};

const CategoriesMajors = () => {
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [openMajorDialog, setOpenMajorDialog] = useState(false);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [openCreateMajorDialog, setOpenCreateMajorDialog] = useState(false);
  const [openCreateFieldDialog, setOpenCreateFieldDialog] = useState(false);
  const [openEditMajorDialog, setOpenEditMajorDialog] = useState(false);
  const [openDeleteMajorDialog, setOpenDeleteMajorDialog] = useState(false);
  const [openDeleteFieldDialog, setOpenDeleteFieldDialog] = useState(false);
  const [majorToDelete, setMajorToDelete] = useState(null);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  
  const [newMajor, setNewMajor] = useState({
    name: "",
    image: "linke",
    fieldId: "",
    subjectId: null,
  });
  
  const [editingMajor, setEditingMajor] = useState({
    id: "",
    name: "",
    image: "linke",
    fieldId: "",
  });
  
  const [newField, setNewField] = useState({
    name: "",
    image: "linke",
  });


  const {
    data: majors,
    isLoading: isLoadingMajors,
    error: errorMajors,
    refetch: refetchMajors,
  } = useQuery({
    queryKey: ["majors"],
    queryFn: fetchMajors,
  });

  const {
    data: fields,
    isLoading: isLoadingFields,
    error: errorFields,
    refetch: refetchFields,
  } = useQuery({
    queryKey: ["fields"],
    queryFn: fetchFields,
  });


  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("https://findcourse.net.uz/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createMajorMutation = useMutation({
    mutationFn: async (majorData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const payload = {
        name: String(majorData.name).trim(),
        image: "linke",
        fieldId: Number(majorData.fieldId),
      };

      console.log("Final Payload:", payload);

      const response = await fetch("https://findcourse.net.uz/api/major", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create major");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      setOpenCreateMajorDialog(false);
      setNewMajor({ name: "", image: "linke", fieldId: "" });
      toast.success("Major created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMajorMutation = useMutation({
    mutationFn: async (majorData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const payload = {
        name: String(majorData.name).trim(),
        image: "linke",
        fieldId: Number(majorData.fieldId),
      };

      const response = await fetch(`https://findcourse.net.uz/api/major/${majorData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update major");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      setOpenEditMajorDialog(false);
      toast.success("Major updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMajorMutation = useMutation({
    mutationFn: async (majorId) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`https://findcourse.net.uz/api/major/${majorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete major");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      setOpenDeleteMajorDialog(false);
      toast.success("Major deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createFieldMutation = useMutation({
    mutationFn: async (fieldData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const payload = {
        name: String(fieldData.name).trim(),
        image: "linke",
      };

      console.log("Field Payload:", payload);

      const response = await fetch("https://findcourse.net.uz/api/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create field");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      setOpenCreateFieldDialog(false);
      setNewField({ name: "", image: "linke" });
      toast.success("Field created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateFieldMutation = useMutation({
    mutationFn: async (fieldData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const payload = {
        name: String(fieldData.name).trim(),
        image: "linke",
      };

      const response = await fetch(`https://findcourse.net.uz/api/fields/${fieldData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update field");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      setOpenEditMajorDialog(false);
      toast.success("Field updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`https://findcourse.net.uz/api/fields/${fieldId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete field");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      setOpenDeleteFieldDialog(false);
      toast.success("Field deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOpenMajor = (major) => {
    setSelectedMajor(major);
    setOpenMajorDialog(true);
  };

  const handleOpenField = (field) => {
    setSelectedField(field);
    setOpenFieldDialog(true);
  };

  const handleCreateMajor = () => {
    createMajorMutation.mutate(newMajor);
  };

  const handleUpdateMajor = () => {
    updateMajorMutation.mutate(editingMajor);
  };

  const handleDeleteMajor = () => {
    deleteMajorMutation.mutate(majorToDelete.id);
  };

  const handleCreateField = () => {
    createFieldMutation.mutate(newField);
  };

  const handleUpdateField = () => {
    updateFieldMutation.mutate(editingMajor);
  };

  const handleDeleteField = () => {
    deleteFieldMutation.mutate(fieldToDelete.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMajor((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditMajorInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMajor((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldInputChange = (e) => {
    const { name, value } = e.target;
    setNewField((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditMajor = (major) => {
    setEditingMajor({
      id: major.id,
      name: major.name,
      image: major.image,
      fieldId: major.fieldId?.toString() || "",
    });
    setOpenEditMajorDialog(true);
  };

  const handleEditField = (field) => {
    setEditingMajor({
      id: field.id,
      name: field.name,
      image: field.image,
    });
    setOpenEditMajorDialog(true);
  };


  const renderCards = (data, isLoading, error, type) => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error.message}</p>;

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[clamp(12px,3vw,24px)] md:gap-[clamp(16px,4vw,32px)]">
        {(type === "major" || type === "field") && (
          <Card
            shadow={true}
            className={`${
              type === "major"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white flex flex-col items-center justify-center p-6 min-w-[150px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer`}
            onClick={() =>
              type === "major"
                ? setOpenCreateMajorDialog(true)
                : setOpenCreateFieldDialog(true)
            }
          >
            <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
              <Icons.FaPlus size={40} />
            </div>
            <Typography variant="h6" className="mt-2 font-medium text-center">
              Add New {type === "major" ? "Major" : "Field"}
            </Typography>
          </Card>
        )}

        {data.map((item, index) => (
          <Card
            key={index}
            shadow={true}
            className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col items-center justify-center p-6 min-w-[150px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer relative"
            onClick={() =>
              type === "major" 
                ? handleOpenMajor(item) 
                : handleOpenField(item)
            }
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <Tooltip content="Edit">
                <IconButton
                  color="blue"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    type === "major" ? handleEditMajor(item) : handleEditField(item);
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
                    if (type === "major") {
                      setMajorToDelete(item);
                      setOpenDeleteMajorDialog(true);
                    } else {
                      setFieldToDelete(item);
                      setOpenDeleteFieldDialog(true);
                    }
                  }}
                >
                  <Icons.FaTrash size={16} />
                </IconButton>
              </Tooltip>
            </div>
            <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
              {getIconForField(item.name)}
            </div>
            <Typography variant="h6" className="mt-2 font-medium text-center">
              {item.name}
            </Typography>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden bg-gray-900 dark:bg-gray-900">
      {/* Categories Section - New Design */}


      {/* Majors Section */}
      <div className="w-full px-6 py-6 bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <Title>Majors</Title>
        </div>
        {renderCards(majors, isLoadingMajors, errorMajors, "major")}
      </div>

      {/* Fields Section */}
      <div className="w-full px-6 py-6 bg-gray-100 dark:bg-gray-900">
        <Title>Fields</Title>
        {renderCards(fields, isLoadingFields, errorFields, "field")}
      </div>

      {/* Major Dialog */}
      <Dialog
        open={openMajorDialog}
        handler={() => setOpenMajorDialog(false)}
        className="bg-[#4B0082] rounded-lg p-4 text-white transition-all duration-500"
      >
        <DialogHeader className="bg-[#4B0082] text-white text-xl font-semibold p-4 rounded-t-lg">
          {selectedMajor?.name}
        </DialogHeader>
        <DialogBody className="bg-[#4B0082] text-white p-4 rounded-b-lg">
          <p>{selectedMajor?.description}</p>
          {selectedMajor?.centers?.length > 0 && (
            <div className="mt-4">
              <h5 className="font-bold">Available Centers:</h5>
              <ul className="list-disc ml-5">
                {selectedMajor.centers.map((center, index) => (
                  <li key={index}>
                    <strong>{center.name}</strong> - {center.address} (
                    <a href={`tel:${center.phone}`} className="text-blue-500">
                      {center.phone}
                    </a>
                    )
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="bg-[#4B0082] p-4 rounded-b-lg">
          <Button
            color="blue"
            onClick={() => setOpenMajorDialog(false)}
            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Field Dialog */}
      <Dialog
        open={openFieldDialog}
        handler={() => setOpenFieldDialog(false)}
        className="bg-[#4B0082] rounded-lg p-4 text-white transition-all duration-500"
      >
        <DialogHeader className="bg-[#4B0082] text-white text-xl font-semibold p-4 rounded-t-lg">
          {selectedField?.name}
        </DialogHeader>
        <DialogBody className="bg-[#4B0082] text-white p-4 rounded-b-lg">
          <p className="font-bold">Majors:</p>
          <ul className="list-disc ml-5">
            {selectedField?.majors?.map((major, index) => (
              <li key={index}>{major.name}</li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter className="bg-[#4B0082] p-4 rounded-b-lg">
          <Button
            color="blue"
            onClick={() => setOpenFieldDialog(false)}
            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Category Dialog */}


      {/* Delete Major Confirmation Dialog */}
      <Dialog
        open={openDeleteMajorDialog}
        handler={() => setOpenDeleteMajorDialog(false)}
        size="sm"
      >
        <DialogHeader>Delete Major</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" className="text-red-500">
            Are you sure you want to delete the major "{majorToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteMajorDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteMajor}
            disabled={deleteMajorMutation.isLoading}
          >
            {deleteMajorMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Field Confirmation Dialog */}
      <Dialog
        open={openDeleteFieldDialog}
        handler={() => setOpenDeleteFieldDialog(false)}
        size="sm"
      >
        <DialogHeader>Delete Field</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" className="text-red-500">
            Are you sure you want to delete the field "{fieldToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteFieldDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteField}
            disabled={deleteFieldMutation.isLoading}
          >
            {deleteFieldMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}


      {/* Create Major Dialog */}
      <Dialog
        open={openCreateMajorDialog}
        handler={() => setOpenCreateMajorDialog(false)}
        size="sm"
      >
        <DialogHeader>Create New Major</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Major Name"
              name="name"
              value={newMajor.name}
              onChange={handleInputChange}
            />
            <Select
              label="Select Field"
              value={newMajor.fieldId}
              onChange={(value) =>
                setNewMajor((prev) => ({ ...prev, fieldId: value }))
              }
            >
              {fields?.map((field) => (
                <Option key={field.id} value={field.id.toString()}>
                  {field.name}
                </Option>
              ))}
            </Select>
            <Input
              label="Image URL"
              name="image"
              value={newMajor.image}
              onChange={handleInputChange}
              disabled
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenCreateMajorDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleCreateMajor}
            disabled={
              !newMajor.name ||
              !newMajor.fieldId ||
              createMajorMutation.isLoading
            }
          >
            {createMajorMutation.isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Major Dialog */}
      <Dialog
        open={openEditMajorDialog}
        handler={() => setOpenEditMajorDialog(false)}
        size="sm"
      >
        <DialogHeader>Edit Major</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Major Name"
              name="name"
              value={editingMajor.name}
              onChange={handleEditMajorInputChange}
            />
            <Select
              label="Select Field"
              value={editingMajor.fieldId}
              onChange={(value) =>
                setEditingMajor((prev) => ({ ...prev, fieldId: value }))
              }
            >
              {fields?.map((field) => (
                <Option key={field.id} value={field.id.toString()}>
                  {field.name}
                </Option>
              ))}
            </Select>
            <Input
              label="Image URL"
              name="image"
              value={editingMajor.image}
              onChange={handleEditMajorInputChange}
              disabled
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenEditMajorDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleUpdateMajor}
            disabled={
              !editingMajor.name ||
              !editingMajor.fieldId ||
              updateMajorMutation.isLoading
            }
          >
            {updateMajorMutation.isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </Dialog>


    </div>
  );
};

export default CategoriesMajors;