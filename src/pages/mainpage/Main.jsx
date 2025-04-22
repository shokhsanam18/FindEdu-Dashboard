import React from "react";
import CategoriesMajors from "./Majors";
import LineGraph from "./linegraph.jsx";
import CentersManagements from "./centersmanagement.jsx";
import RegionsSubjectsManagement from "./RegionsSubjectsManagement.jsx";
import ReceptionManagement from "./ReceptionManagement.jsx";



const Main = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <CategoriesMajors />
      <RegionsSubjectsManagement/>
      <ReceptionManagement/>
      <LineGraph />
      <CentersManagements />
      
    </div>
  );
};

export default Main;
