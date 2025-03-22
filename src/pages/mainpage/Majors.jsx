import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";

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
  const response = await fetch("http://18.141.233.37:4000/api/major");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  const data = await response.json();
  return data.data || [];
};

const fetchFields = async () => {
  const response = await fetch("http://18.141.233.37:4000/api/fields");
  if (!response.ok) throw new Error("Ошибка загрузки данных");
  const data = await response.json();
  return data.data || [];
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
      <div className="w-full grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
        {data.map((item, index) => (
          <Card
            key={index}
            shadow={true}
            className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col items-center justify-center p-6 min-w-[120px] sm:min-w-[140px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <div className="text-4xl p-4 rounded-lg transition-colors duration-300">
              {item.icon || "📚"}
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
    <>
      <div className="w-full px-6 py-6 bg-gray-100">
        <Title>Majors</Title>
        {renderCards(majors, isLoadingMajors, errorMajors)}
      </div>
      <div className="w-full px-6 py-6 bg-gray-100">
        <Title>Fields</Title>
        {renderCards(fields, isLoadingFields, errorFields)}
      </div>
    </>
  );
};

export default CategoriesMajors;

// import React from "react";
// import { Card, Typography } from "@material-tailwind/react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   FaCode,
//   FaAndroid,
//   FaBullhorn,
//   FaCamera,
//   FaFutbol,
//   FaBook,
// } from "react-icons/fa";

// export const Title = ({ children }) => {
//   return (
//     <Typography
//       variant="h4"
//       style={{ color: "#007BFF" }}
//       className="uppercase font-bold mb-4"
//     >
//       {children}
//     </Typography>
//   );
// };

// const fetchMajors = async () => {
//   const response = await fetch("http://18.141.233.37:4000/api/major");
//   if (!response.ok) throw new Error("Ошибка загрузки данных");
//   const data = await response.json();
//   return data.data || [];
// };

// // Объект для соответствия majors и иконок
// const majorIcons = {
//   "Web dasturlash": <FaCode size={40} />,
//   "Android dasturlash": <FaAndroid size={40} />,
//   SMM: <FaBullhorn size={40} />,
//   Mobilografiya: <FaCamera size={40} />,
//   Fudbol: <FaFutbol size={40} />,
//   Boks: <FaBook size={40} />,
// };

// const CategoriesMajors = () => {
//   const {
//     data: majors,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["majors"],
//     queryFn: fetchMajors,
//   });

//   return (
//     <div className="w-full min-h-screen px-6 py-6 bg-gray-100 overflow-hidden">
//       <Title>Majors</Title>
//       {isLoading && <p>Loading...</p>}
//       {error && <p className="text-red-500">Ошибка: {error.message}</p>}
//       {!isLoading && !error && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
//           {majors.map((item, index) => (
//             <Card
//               key={index}
//               shadow={true}
//               className="bg-[#4B0082] hover:bg-[#007BFF] text-white flex flex-col items-center justify-center p-6 min-w-[120px] sm:min-w-[140px] h-40 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
//             >
//               <div className="text-4xl p-4 rounded-lg transition-colors duration-300 ">
//                 {majorIcons[item.name] || "📚"}{" "}
//                 {/* Если нет в списке, ставим 📚 */}
//               </div>
//               <Typography variant="h6" className="mt-2 font-medium text-center">
//                 {item.name}
//               </Typography>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoriesMajors;
