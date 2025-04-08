import React, { useState } from "react";
import {
  Card,
  Typography,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "react-icons/fa";

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

  const handleOpenMajor = (major) => {
    setSelectedMajor(major);
    setOpenMajorDialog(true);
  };

  const handleOpenField = (field) => {
    setSelectedField(field);
    setOpenFieldDialog(true);
  };

  const renderCards = (data, isLoading, error, type) => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error.message}</p>;

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[clamp(12px,3vw,24px)] md:gap-[clamp(16px,4vw,32px)]">
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
              {type === "major"
                ? getIconForField(item.name)
                : getIconForField(item.name)}
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
        <Title>Majors</Title>
        {renderCards(majors, isLoadingMajors, errorMajors, "major")}
      </div>
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
    </div>
  );
};

export default CategoriesMajors;
