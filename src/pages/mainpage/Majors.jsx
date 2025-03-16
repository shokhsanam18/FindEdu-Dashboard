import React from "react";
import { Card, Typography } from "@material-tailwind/react";

export const Title = ({ children }) => {
  return (
    <Typography
      variant="h4"
      style={{ color: "#007BFF " }}
      className="uppercase font-bold mb-4"
    >
      {children}
    </Typography>
  );
};

const CategoriesMajors = () => {
  const categories = [
    { name: "Mintaqa", icon: "🌍" },
    { name: "Darajasi", icon: "📊" },
    { name: "O'qish turi", icon: "🏫" },
    { name: "Yo'nalish", icon: "🚉" },
    { name: "Narxi", icon: "💵" },
  ];

  const majors = [
    { name: "Informatika", icon: "💻" },
    { name: "Biznes", icon: "📈" },
    { name: "Muhandislik", icon: "🏗️" },
    { name: "Tibbiyot", icon: "⚕️" },
    { name: "San'at", icon: "🎨" },
    { name: "Huquq", icon: "⚖️" },
    { name: "Psixologiya", icon: "🧠" },
    { name: "Biologiya", icon: "🧬" },
    { name: "Kimyo", icon: "🧪" },
    { name: "Fizika", icon: "🔬" },
    { name: "Matematika", icon: "📐" },
    { name: "Filologiya", icon: "📖" },
  ];

  return (
    <div className="w-full min-h-screen px-6 py-6 bg-gray-100 overflow-hidden">
      <Title>Categories</Title>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 mb-10">
        {categories.map((item, index) => (
          <Card
            key={index}
            shadow={true}
            className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col  items-center justify-center p-6 min-w-[120px] sm:min-w-[140px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
              {item.icon}
            </div>
            <Typography variant="h6" className="mt-2 font-medium text-center">
              {item.name}
            </Typography>
          </Card>
        ))}
      </div>

      <Title>Majors</Title>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
        {majors.map((item, index) => (
          <Card
            key={index}
            shadow={true}
            className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col items-center justify-center p-6 min-w-[120px] sm:min-w-[140px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <div className="text-4xl p-4 rounded-lg transition-colors duration-300 ">
              {item.icon}
            </div>
            <Typography variant="h6" className="mt-2 font-medium text-center">
              {item.name}
            </Typography>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMajors;
