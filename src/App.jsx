// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Route, Routes } from "react-router-dom";
// import CEO from "./pages/CEO";
// import Users from "./pages/Users";
// import Main from "./pages/mainpage/Main";
// import Layout from "./components/Layout";
// import Settings from "./pages/Settings";
// import MyProfile from "./pages/MyProfile";
// import Login from "./pages/Login/Login";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { useAuthStore, useThemeStore } from "./Store";
// import { useEffect } from "react";
// import { ThemeProvider } from "@material-tailwind/react";

// const queryClient = new QueryClient();

// function App() {
//   const theme = useThemeStore((state) => state.theme);
//   const applyTheme = useThemeStore((state) => state.applyTheme);

//   useEffect(() => {
//     applyTheme();

//     if (theme === "system") {
//       const listener = () => applyTheme();
//       const media = window.matchMedia("(prefers-color-scheme: dark)");
//       media.addEventListener("change", listener);
//       return () => media.removeEventListener("change", listener);
//     }
//   }, [theme]);

//   const fetchUserData = useAuthStore((state) => state.fetchUserData);
//   const accessToken = useAuthStore((state) => state.accessToken);

//   useEffect(() => {
//     if (accessToken) {
//       fetchUserData();
//     }
//   }, [accessToken, fetchUserData]);

//   return (
//     <ThemeProvider>
//       <QueryClientProvider client={queryClient}>
//         <Routes>
//           <Route path="/Login" element={<Login />} />
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute requiredRole="ADMIN">
//                 <Layout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Main />} />
//             <Route
//               path="Users"
//               element={
//                 <ProtectedRoute requiredRole="ADMIN">
//                   <Users />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="CEO"
//               element={
//                 <ProtectedRoute requiredRole="ADMIN">
//                   <CEO />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="Settings" element={<Settings />} />
//             <Route path="MyProfile" element={<MyProfile />} />
//           </Route>
//           <Route path="*" element={<div>404 Not Found</div>} />
//         </Routes>
//       </QueryClientProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
k