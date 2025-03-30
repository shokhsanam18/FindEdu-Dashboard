import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useCenterStore } from "../../Store";

const CentersManagement = () => {
  const [newCenter, setNewCenter] = useState({ name: "", location: "" });

  const {
    centers,
    fetchCenters,
    addCenter,
    deleteCenter,
    loading,
    error,
  } = useCenterStore()

  useEffect(() => {
    fetchCenters();
    const interval = setInterval(() => {
      useCenterStore.getState().fetchCenters();
    }, 15 * 60 * 1000); // 15 min

    return () => clearInterval(interval);
  }, []);

  const handleAddCenter = async () => {
    if (!newCenter.name || !newCenter.location) return;
    await addCenter(newCenter);
    setNewCenter({ name: "", location: "" });
  };

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
