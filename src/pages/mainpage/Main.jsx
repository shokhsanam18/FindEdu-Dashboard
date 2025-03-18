import React from "react";
import CategoriesMajors from "./Majors";
import VisitorChart from "./linegraph.jsx";
const Main = () => {
  return (
    <div className="flex-1">
      <CategoriesMajors />
      <VisitorChart />
    </div>
  );
};

export default Main;
