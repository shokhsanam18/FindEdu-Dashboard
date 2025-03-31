import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://18.141.233.37:4000";
const ImageApi = `${API_BASE}/api/image`;

const AddCenter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = "";
      if (formData.image) {
        const imageForm = new FormData();
        imageForm.append("file", formData.image);
        const imageResponse = await axios.post(ImageApi, imageForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = imageResponse.data.url;
      }

      const response = await axios.post(`${API_BASE}/api/centers`, {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        image: imageUrl,
      });

      navigate(`/centers/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add center");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Learning Center</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Center Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
          {loading ? "Adding..." : "Add Center"}
        </button>
      </form>
    </div>
  );
};

export default AddCenter;
