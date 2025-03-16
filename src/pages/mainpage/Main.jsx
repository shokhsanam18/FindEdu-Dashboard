import React from "react";
import Header from "./header";
import CategoriesMajors from "./Majors";
import VisitorChart from "./linegraph.jsx";
const Main = () => {
  return (
    <div className="flex-1">
      <Header />
      <CategoriesMajors />
      <VisitorChart />
    </div>
  );
};

export default Main;
