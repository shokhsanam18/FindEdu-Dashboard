import { useEffect, useState, useRef } from "react";
import axios from "axios";

const CentersManagement = () => {
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(
        "http://18.141.233.37:4000/api/refresh-token",
        { refreshToken: tokenRef.current }
      );

      const newToken = response.data.accessToken;
      setToken(newToken);
      tokenRef.current = newToken;
      localStorage.setItem("authToken", newToken); 
      console.log("Token updated:", newToken);

      fetchCenters(newToken);
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error);
      setError("Failed to refresh token. Please log in again.");
    }
  };

  const fetchCenters = async (authToken = tokenRef.current) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://18.141.233.37:4000/api/centers",
        {
          headers: { Authorization: `Bearer ${authToken}` }, 
        }
      );

      console.log("API Response:", response.data);
      setCenters(response.data.data || []);
    } catch (error) {
      console.error("Error fetching centers:", error);
      if (error.response?.status === 401) {
        console.log("Token expired, refreshing...");
        await refreshAuthToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCenter = async () => {
    if (token) {
      try {
        const response = await axios.post(
          "http://18.141.233.37:4000/api/centers",
          newCenter,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCenters([...centers, response.data]);
        setNewCenter({ name: "", location: "" });
      } catch (error) {
        console.error("Error adding center:", error);
        setError("Failed to add center.");
      }
    } else {
      setError("Authentication token is missing.");
    }
  };

  const handleDeleteCenter = async (centerId) => {
    if (token) {
      try {
        await axios.delete(
          `http://18.141.233.37:4000/api/centers/${centerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCenters(centers.filter((center) => center.id !== centerId));
      } catch (error) {
        console.error("Error deleting center:", error);
        setError("Failed to delete center.");
      }
    } else {
      setError("Authentication token is missing.");
    }
  };

  useEffect(() => {
    fetchCenters();

    const tokenInterval = setInterval(refreshAuthToken, 15 * 60 * 1000);

    return () => clearInterval(tokenInterval);
  }, []);

  return (
    <div className="centers-management">
      <h2>Centers Management</h2>

      {error && <div className="error-message">{error}</div>}

      <div>
        <h3>Add New Center</h3>
        <input
          type="text"
          placeholder="Name"
          value={newCenter.name}
          onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newCenter.location}
          onChange={(e) =>
            setNewCenter({ ...newCenter, location: e.target.value })
          }
        />
        <button onClick={handleAddCenter}>Add Center</button>
      </div>

      <h3>Centers List</h3>
      <ul>
        {loading ? (
          <p>Loading centers...</p>
        ) : centers.length > 0 ? (
          centers.map((center) => (
            <li key={center.id}>
              {center.name} - {center.location}
              <button onClick={() => handleDeleteCenter(center.id)}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No centers available.</p>
        )}
      </ul>
    </div>
  );
};

export default CentersManagement;
