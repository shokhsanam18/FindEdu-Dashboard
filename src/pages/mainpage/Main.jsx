import React from "react";
import Header from "./header";
import Categories from "./categories";
import Majors from "./Majors";
const Main = () => {
  return (
    <div className="flex-1">
      {/* <Header /> */}
      <Categories />
      <Majors />
    </div>
  );
};

export default Main;
