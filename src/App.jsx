import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import UserPage from "./User-page/User-page";

function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="bg-red-400 p-2">hello dashboard</h1>
        <Button>Hello world</Button>
      </div>
      <Routes>
        <Route
          path="/"
          element={<h1 className="text-center mt-4">Home Page</h1>}
        />
        <Route path="/users" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
