import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import CEO from "./pages/CEO";
import Users from "./pages/Users";
import Main from "./pages/mainpage/Main";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/CEO" element={<CEO />} />
          <Route path="/Settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<div>404 Not found</div>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
