import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";

const centerSchema = z.object({
  name: z.string().min(3, "Center name is required"),
  regionId: z.string().min(1, "Region is required"),
  address: z.string().min(5, "Address is required"),
  image: z.any().refine((file) => file !== null, "Image is required"),
  majorsId: z.array(z.string()).nonempty("At least one major is required"),
  phone: z.string().min(10, "Phone number is required"),
});

export default function CeoPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(centerSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [majors, setMajors] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [selectedMajors, setSelectedMajors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const fetchData = async () => {
      try {
        const [regionsRes, majorsRes] = await Promise.all([
          axios.get(
            "https://findcourse.net.uz/api/regions/search?page=1&limit=500",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get("https://findcourse.net.uz/api/major", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRegions(regionsRes.data.data);
        setMajors(majorsRes.data.data);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setValue("image", file, { shouldValidate: true });
  };

  const handleMajorSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedMajors(selected);
    setValue("majorsId", selected, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      if (!imageFile) {
        toast.error("Please upload an image");
        return;
      }

      const formData = {
        name: data.name,
        regionId: data.regionId,
        address: data.address,
        phone: data.phone,
        majorsId: data.majorsId,
        image: "",
      };

      const uploadData = new FormData();
      uploadData.append("image", imageFile);

      const response = await axios.post(
        "https://findcourse.net.uz/api/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      formData.image = response.data.data;

      await axios.post("https://findcourse.net.uz/api/centers", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      toast.success("Learning Center added successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create center. Please try again."
      );
    }
  };

  return (
    <div className="bg-[#f1edfa] md:mb-auto mb-[350px]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col md:flex-row justify-between items-center md:items-center p-6 min-h-[50vh] text-white bg-cover bg-center mt-37"
        style={{ backgroundImage: "url('/ceopage.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-sm px-3 text-center md:px-6 md:text-start mt-2 md:mt-8 text-sm"
        >
          <p className="text-l md:text-2xl  mt-6 md:mt-0">
            {" "}
            Add Your Education Center
          </p>
          <p className="text-l md:text-l  mt-20 md:mt-0">
            Join us and help students discover the best learning opportunities.
          </p>
          <h1 className="text-4xl md:text-7xl font-bold "> CEO Page</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex flex-col md:flex-row gap-1 md:gap-2 ml-6 md:mr-10 md:text-xl  mt-4 md:mt-0"
        >
          <div className="flex gap-2">
            <Link to="/" className="no-underline hover:underline text-white">
              {" "}
              Home
            </Link>
            <p>|</p>
            <Link
              to="/"
              className="text-[#bbbbbb] no-underline hover:underline"
            >
              CEO Page{" "}
            </Link>
          </div>
        </motion.div>
      </motion.div>
      <div className="flex flex-col md:flex-row w-full bg-[#f1edfa] justify-center items-center m-0 h-screen my-20 ">
        <div className="flex h-screen justify-center items-center ">
          <motion.img
            src={ceo}
            alt="Our Mission"
            className="max-w-[250px] flex md:max-w-[450px] max-h-[1000px] object-contain ml-0 md:ml-[110px] cursor-pointer justify-center items-center md:mt-0 mt-[600px] "
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.9, ease: "easeInOut" },
            }}
          />
        </div>

        <div className="flex justify-center items-center w-full md:w-screen h-screen py-[500px] md:mt-0 mt-[50px]">
          <Toaster theme="light" position="top-right" richColors />
          <div className="bg-white shadow-lg rounded-lg p-7 max-w-3xl w-full ">
            <h2 className="text-4xl font-bold text-center text-purple-900 mb-6">
              Create Learning Center
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700">
                  Center Name
                </label>
                <Input placeholder="Enter center name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  Region
                </label>
                <select
                  {...register("regionId")}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && (
                  <p className="text-red-500 text-sm">
                    {errors.regionId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  Address
                </label>
                <Input placeholder="Enter address" {...register("address")} />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Center Image <span className="text-red-500">*</span>
                </label>

                {imageFile ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setValue("image", null, { shouldValidate: true });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {imageFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(imageFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <label className="block">
                    <div
                      className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                        errors.image
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                    >
                      <svg
                        className="mx-auto h-8 w-12 text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                      />
                    </div>
                  </label>
                )}

                {errors.image && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.image.message}
                  </p>
                )}
              </div>

              <Input
                placeholder="Enter phone number"
                type="tel"
                value={
                  watch("phone")?.startsWith("+998")
                    ? watch("phone")
                    : `+998${watch("phone") || ""}`
                }
                onChange={(e) => {
                  const numbers = e.target.value.replace(/\D/g, "");
                  const fullNumber = numbers.startsWith("998")
                    ? `+${numbers.slice(0, 12)}`
                    : `+998${numbers.slice(0, 9)}`;
                  setValue("phone", fullNumber, { shouldValidate: true });
                }}
              />

              <div>
                <label className="block font-semibold text-gray-700">
                  Majors
                </label>
                <select
                  multiple
                  {...register("majorsId")}
                  onChange={handleMajorSelect}
                  className="w-full p-2 border rounded bg-white focus:ring focus:ring-violet-300 outline-none"
                >
                  {majors.map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
                {errors.majorsId && (
                  <p className="text-red-500 text-sm">
                    {errors.majorsId.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-900 hover:bg-blue-900 text-white py-2 rounded-lg cursor-pointer"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Add Center"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
