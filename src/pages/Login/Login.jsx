import { motion } from "framer-motion";
import { Toaster as Sonner, toast } from "sonner";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import purple from "/public/img/purple.png";
import icon from "/public/img/icon.png";
import register from "/public/img/register.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../../Store"; 
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormControl, FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const API_BASE = "http://18.141.233.37:4000/api";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Min 6 characters" }),
});

const axiosInstance = axios.create({
  baseURL: API_BASE,});

const refreshAccessToken = async (navigate) => {
  try {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${API_BASE}/refresh`, { refreshToken: storedRefreshToken });
    
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      } catch {
        console.error("Token refresh failed, redirecting to login.");
      }
    }
    return Promise.reject(error);
  }
);

const Login = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");
      
      const response = await axios.post(`${API_BASE}/users/refresh`, { refreshToken });
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {

      console.error("Refresh token failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
      throw error;
    }
  };


  const loginUser = async (values) => {
    const login = useAuthStore.getState().login;
  
    try {
      const result = await login(values);
  
      if (result.success) {
        const role = result.role ? result.role.toUpperCase() : "USER";
  
        console.log("Debug: Raw role received:", result.role);
        console.log(" Debug: Processed role after cleanup:", role);
  
setTimeout(() => {
if (role === "USER") {
toast.success("Login successful! Redirecting...");
 navigate("/"); 
} else if (role === "CEO") {
toast.success("Login successful! Redirecting...");
            navigate("/ceo"); 
} else if (role === "ADMIN") {
  toast.success("Login successful! Redirecting...");
              navigate("/"); 
  } else {
 console.error(" Unexpected role received:", role);
  toast.error("Unknown role, please contact support.");
}}, 1500);
} else {
 if (!result.message?.includes("Password or email is wrong")) {
  toast.error(result.message || "Invalid credentials");}
  }
  } catch (err) {
  console.error(" Login error:", err);
  toast.error("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#6d24b719] ">
  <Sonner theme="light" position="top-right" richColors />
      <Link to="/">
<div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold cursor-pointer">
<p className="flex">F<img src={icon} alt="Logo" className="h-7 w-4 mx-1 mt-3" />ndedu.uz</p>
</div>
</Link>
<div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-white to-purple-100 items-center justify-center p-8 relative ">
        <div className="absolute top-8 left-14 flex items-center text-[#461773] text-[32px] font-bold">
 F<img src={icon} alt="Logo" className="h-7 w-4 mx-1" />ndedu.uz
        </div>
 <div className="text-[#461773] text-center relative ml-20 cursor-pointer">
<h2 className="text-4xl font-bold mb-20">Welcome Back!</h2>

<motion.img
src={register} alt="Illustration" className="w-[500px] h-auto relative z-10" whileHover={{ y: -20 }} transition={{ type: "spring", stiffness: 50, damping: 20 }}/>

<img className="z-0 absolute bottom-[-32px] left-1/15  transform  w-[400px] h-[90px]" src={purple} alt="Shadow Effect" />
</div>
</div>

<div className="w-full md:w-2/3 flex items-center justify-center p-6 md:p-16 bg-gradient-to-b from-white to-purple-100 h-screen">
<div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
<h2 className="text-4xl font-bold text-[#461773] mb-6 text-center">Login</h2>

<Form {...form}>
<form onSubmit={form.handleSubmit(loginUser)} className="space-y-4">
<FormField control={form.control} name="email" render={({ field }) => (
<FormItem>
<FormControl>
<Input placeholder="Email" {...field} />
</FormControl>{" "}
<FormMessage />
</FormItem>)}/>

<FormField control={form.control} name="password" render={({ field }) => (
<FormItem>
<FormControl>
<Input type="password" placeholder="Password" {...field}/>
</FormControl>{" "}
<FormMessage />
</FormItem>)}/>

<Button type="submit" onClick={form.handleSubmit(loginUser)} className="w-full bg-[#461773] text-white font-bold rounded-md hover:bg-purple-700 transition h-[50px] cursor-pointer">
Login</Button></form>{" "}
</Form>

 {/* <p className="text-m text-gray-600 mt-4 text-center"> Don't have an account?{" "}
<Link to="/register" className="text-purple-600 font-semibold hover:underline">Register</Link></p>
<Link to="/forget">{" "}
<h2 className="text-m text-center mt-6 underline cursor-pointer">
              Forgot Password?
            </h2>{" "}
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
