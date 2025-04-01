import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import {
  FaCode,
  FaAndroid,
  FaBullhorn,
  FaCamera,
  FaFutbol,
  FaBook,
} from "react-icons/fa";

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
  localStorage.setItem("majors", JSON.stringify(data.data));
  return data.data || [];
};

const fetchFields = async () => {
  const response = await fetch("https://findcourse.net.uz/api/fields");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  const data = await response.json();
  localStorage.setItem("fields", JSON.stringify(data.data));
  return data.data || [];
};

const majorIcons = {
  "Web dasturlash": <FaCode size={40} />,
  "Android dasturlash": <FaAndroid size={40} />,
  SMM: <FaBullhorn size={40} />,
  Mobilografiya: <FaCamera size={40} />,
  Fudbol: <FaFutbol size={40} />,
  Boks: <FaBook size={40} />,
};

const CategoriesMajors = () => {
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

  const renderCards = (data, isLoading, error) => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error.message}</p>;

    return (
      <div className="grid  dark:bg-gray-900 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[clamp(12px,3vw,24px)] md:gap-[clamp(16px,4vw,32px)]">
        {data.map((item, index) => (
          <Card
            key={index}
            shadow={true}
            className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col items-center justify-center p-6 min-w-[150px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
              {majorIcons[item.name] || "📚"}
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
    <div className="overflow-x-hidden  dark:bg-gray-900">
      <div className="w-full px-6 py-6 dark:bg-gray-900 bg-gray-100">
        <Title>Majors</Title>
        {renderCards(majors, isLoadingMajors, errorMajors)}
      </div>
      <div className="w-full px-6 py-6 dark:bg-gray-900 bg-gray-100">
        <Title>Fields</Title>
        {renderCards(fields, isLoadingFields, errorFields)}
      </div>
    </div>
  );
};

export default CategoriesMajors;
