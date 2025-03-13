import { Button } from "@material-tailwind/react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CEO from "./pages/CEO";
import Users from "./pages/Users";
import Main from "./pages/Main";

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/CEO" element={<CEO />} />
        </Route>
        <Route path="*" element={<div>404 Not found</div>} />
      </Routes>
    </div>
  );
}

export default App;
