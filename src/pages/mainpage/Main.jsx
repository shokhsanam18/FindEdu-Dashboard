import React from "react";
import CategoriesMajors from "./Majors";
import LineGraph from "./linegraph.jsx";
import CentersManagements from "./centersmanagement.jsx";
// import RegionsSubjectsManagement from "./RegionsSubjectsManagement.jsx";
import ReceptionManagement from "./ReceptionManagement.jsx";
import Categoriesmanagement from "./categorymanagement.jsx";
import RegionsManagement from "./RegionsManagement.jsx";
import SubjectsManagement from "./SubjectsManagement.jsx";



const Main = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <CategoriesMajors />
      <Categoriesmanagement/>
      <RegionsManagement/>
      <SubjectsManagement/>
      {/* <RegionsSubjectsManagement/> */}
      <ReceptionManagement/>
      <LineGraph />
      <CentersManagements />
      
    </div>
  );
};

export default Main;
