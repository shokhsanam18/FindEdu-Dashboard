import { Button } from "@material-tailwind/react";
import { Route, Routes } from "react-router-dom";

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
