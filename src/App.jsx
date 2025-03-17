import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import CEO from "./pages/CEO";
import Users from "./pages/Users";
import Main from "./pages/mainpage/Main";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/CEO" element={<CEO />} />
        <Route path="*" element={<div>404 Not found</div>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
