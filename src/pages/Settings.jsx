import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/dark";
const Settings = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="w-full h-[3px] bg-slate-400 mb-6"></div>
      <div>
        <h2 className="text-xl font-bold">Theme</h2>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Settings;
