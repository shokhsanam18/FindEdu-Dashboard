import React from "react";
import CategoriesMajors from "./Majors";
import LineGraph from "./linegraph.jsx";
import CentersManagements from "./centersmanagement.jsx";
const Main = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <CategoriesMajors />
      <LineGraph />
      <CentersManagements />
    </div>
  );
};

export default Main;
