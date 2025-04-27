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

const fetchCategories = async () => {
  const response = await fetch("https://findcourse.net.uz/api/categories");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  const data = await response.json();
  localStorage.setItem("categories", JSON.stringify(data.data));
  return data.data || [];
};

const getIconForField = (name) => {
  const iconList = Object.values(Icons);
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return React.createElement(iconList[hash % iconList.length], { size: 40 });
};

const Categoriesmanagement = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openCreateCategoryDialog, setOpenCreateCategoryDialog] =
    useState(false);
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState(false);
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    image: "",
  });

  const [editingCategory, setEditingCategory] = useState({
    id: "",
    name: "",
    image: "",
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
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

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      let imageUrl = "";

      if (imageFile) {
        const uploadResponse = await uploadImageMutation.mutateAsync(imageFile);
        imageUrl = uploadResponse.data;
      }

      const payload = {
        name: String(categoryData.name).trim(),
        image: imageUrl || "default-image.png",
      };

      const response = await fetch("https://findcourse.net.uz/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpenCreateCategoryDialog(false);
      setImageFile(null);
      setImagePreview(null);
      setNewCategory({ name: "", image: "" });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      let imageUrl = categoryData.image;

      if (editImageFile) {
        const uploadResponse = await uploadImageMutation.mutateAsync(
          editImageFile
        );
        imageUrl = uploadResponse.data;
      }

      const payload = {
        name: String(categoryData.name).trim(),
        image: imageUrl || categoryData.image,
      };

      const response = await fetch(
        `https://findcourse.net.uz/api/categories/${categoryData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpenEditCategoryDialog(false);
      setEditImageFile(null);
      setEditImagePreview(null);
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId) => {
      const token = await useAuthStore.getState().refreshTokenFunc();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `https://findcourse.net.uz/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpenDeleteCategoryDialog(false);
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOpenCategory = (category) => {
    setSelectedCategory(category);
    setOpenCategoryDialog(true);
  };

  const handleCreateCategory = async () => {
    createCategoryMutation.mutate(newCategory);
  };

  const handleUpdateCategory = async () => {
    updateCategoryMutation.mutate(editingCategory);
  };

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate(categoryToDelete.id);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory((prev) => ({ ...prev, [name]: value }));
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

  const handleEditCategory = (category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      image: category.image,
    });
    setEditImagePreview(
      category.image
        ? `https://findcourse.net.uz/api/image/${category.image}`
        : null
    );
    setOpenEditCategoryDialog(true);
  };

  const renderCategoryCards = () => {
    if (isLoadingCategories) return <p>Loading...</p>;
    if (errorCategories)
      return <p className="text-red-500">Ошибка: {errorCategories.message}</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card
          shadow={true}
          className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center p-6 h-48 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          onClick={() => setOpenCreateCategoryDialog(true)}
        >
          <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
            <Icons.FaPlus size={40} />
          </div>
          <Typography variant="h6" className="mt-2 font-medium text-center">
            Add New Category
          </Typography>
        </Card>

        {categories?.map((category) => (
          <Card
            key={category.id}
            shadow={true}
            className="relative bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white p-6 h-48 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <Tooltip content="Edit">
                <IconButton
                  color="blue"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(category);
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
                    setCategoryToDelete(category);
                    setOpenDeleteCategoryDialog(true);
                  }}
                >
                  <Icons.FaTrash size={16} />
                </IconButton>
              </Tooltip>
            </div>

            <div
              className="flex flex-col items-center justify-center h-full"
              onClick={() => handleOpenCategory(category)}
            >
              {category.image ? (
                <img
                  src={`https://findcourse.net.uz/api/image/${category.image}`}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-full mb-3"
                />
              ) : (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                  <Icons.FaImage size={24} />
                </div>
              )}
              <Typography variant="h6" className="font-medium text-center">
                {category.name}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
    );
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
              type === "major" ? handleOpenMajor(item) : handleOpenField(item)
            }
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <Tooltip content="Edit">
                <IconButton
                  color="blue"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    type === "major"
                      ? handleEditMajor(item)
                      : handleEditField(item);
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
      <div className="w-full px-6 py-6 bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <Title>Categories</Title>
        </div>
        {renderCategoryCards()}
      </div>

      <Dialog
        open={openCategoryDialog}
        handler={() => setOpenCategoryDialog(false)}
        className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg p-4 text-white transition-all duration-500"
      >
        <DialogHeader className="bg-transparent text-white text-xl font-semibold p-4 rounded-t-lg">
          {selectedCategory?.name}
        </DialogHeader>
        <DialogBody className="bg-transparent p-4 rounded-b-lg">
          <div className="flex flex-col items-center">
            {selectedCategory?.image ? (
              <img
                src={`https://findcourse.net.uz/api/image/${selectedCategory.image}`}
                alt={selectedCategory.name}
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Icons.FaImage size={48} />
              </div>
            )}
            <Typography variant="paragraph" className="text-center">
              {selectedCategory?.description || "No description available"}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter className="bg-transparent p-4 rounded-b-lg">
          <Button
            color="blue"
            onClick={() => setOpenCategoryDialog(false)}
            className="bg-white text-blue-500 hover:bg-gray-100 transition-colors duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openDeleteCategoryDialog}
        handler={() => setOpenDeleteCategoryDialog(false)}
        size="sm"
      >
        <DialogHeader>Delete Category</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" className="text-red-500">
            Are you sure you want to delete the category "
            {categoryToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteCategoryDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteCategory}
            disabled={deleteCategoryMutation.isLoading}
          >
            {deleteCategoryMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openCreateCategoryDialog}
        handler={() => setOpenCreateCategoryDialog(false)}
        size="sm"
      >
        <DialogHeader>Create New Category</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Category Name"
              name="name"
              value={newCategory.name}
              onChange={handleCategoryInputChange}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setOpenCreateCategoryDialog(false);
              setImageFile(null);
              setImagePreview(null);
            }}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleCreateCategory}
            disabled={!newCategory.name || createCategoryMutation.isLoading}
          >
            {createCategoryMutation.isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openEditCategoryDialog}
        handler={() => setOpenEditCategoryDialog(false)}
        size="sm"
      >
        <DialogHeader>Edit Category</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Category Name"
              name="name"
              value={editingCategory.name}
              onChange={handleEditCategoryInputChange}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Category Image
              </label>
              {editImagePreview && (
                <div className="mb-2">
                  <img
                    src={editImagePreview}
                    alt="Current"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Typography variant="small" className="text-gray-600 mt-1">
                    Current Image
                  </Typography>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {editImageFile && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(editImageFile)}
                    alt="New Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Typography variant="small" className="text-gray-600 mt-1">
                    New Image Preview
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setOpenEditCategoryDialog(false);
              setEditImageFile(null);
              setEditImagePreview(null);
            }}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleUpdateCategory}
            disabled={!editingCategory.name || updateCategoryMutation.isLoading}
          >
            {updateCategoryMutation.isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Categoriesmanagement;
