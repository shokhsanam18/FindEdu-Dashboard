import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import CEO from "./pages/CEO";
import Users from "./pages/Users";
import Main from "./pages/mainpage/Main";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import MyProfile from "./pages/MyProfile";
import { ThemeProvider } from "./components/context/theme";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/CEO" element={<CEO />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/MyProfile" element={<MyProfile />} />
          </Route>
          <Route path="*" element={<div>404 Not found</div>} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
