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
} from "@material-tailwind/react";
import { useAuthStore } from "../../Store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import * as Icons from "react-icons/fa";
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
    name: major.name,
    description: major.description || "No description available",
    centers: major.centers || [],
    link: "/",
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
  const [newMajor, setNewMajor] = useState({
    name: "",
    image: "linke",
    fieldId: "",
    subjectId: null,
  });
  const [newField, setNewField] = useState({
    name: "",
    image: "linke",
  });

  const {
    data: majors,
    isLoading: isLoadingMajors,
    error: errorMajors,
  } = useQuery({
    queryKey: ["majors"],
    queryFn: fetchMajors,
  });

  const {
    data: fields,
    isLoading: isLoadingFields,
    error: errorFields,
  } = useQuery({
    queryKey: ["fields"],
    queryFn: fetchFields,
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

  const handleCreateField = () => {
    createFieldMutation.mutate(newField);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMajor((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldInputChange = (e) => {
    const { name, value } = e.target;
    setNewField((prev) => ({ ...prev, [name]: value }));
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
            className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col items-center justify-center p-6 min-w-[150px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() =>
              type === "major" ? handleOpenMajor(item) : handleOpenField(item)
            }
          >
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
        <div className="flex justify-between items-center mb-4">
          <Title>Majors</Title>
        </div>
        {renderCards(majors, isLoadingMajors, errorMajors, "major")}
      </div>
      <div className="w-full px-6 py-6 bg-gray-100 dark:bg-gray-900">
        <Title>Fields</Title>
        {renderCards(fields, isLoadingFields, errorFields, "field")}
      </div>

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

      <Dialog
        open={openCreateFieldDialog}
        handler={() => setOpenCreateFieldDialog(false)}
        size="sm"
      >
        <DialogHeader>Create New Field</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Field Name"
              name="name"
              value={newField.name}
              onChange={handleFieldInputChange}
            />
            <Input
              label="Image URL"
              name="image"
              value={newField.image}
              onChange={handleFieldInputChange}
              disabled
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenCreateFieldDialog(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleCreateField}
            disabled={!newField.name || createFieldMutation.isLoading}
          >
            {createFieldMutation.isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default CategoriesMajors;
