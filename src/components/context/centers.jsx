// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useCenterStore } from "../../Store";

// const CentersManagement = () => {
//   const [newCenter, setNewCenter] = useState({ name: "", location: "" });

//   const {
//     centers,
//     fetchCenters,
//     addCenter,
//     deleteCenter,
//     loading,
//     error,
//   } = useCenterStore()

//   useEffect(() => {
//     fetchCenters();
//     const interval = setInterval(() => {
//       useCenterStore.getState().fetchCenters();
//     }, 15 * 60 * 1000); // 15 min

//     return () => clearInterval(interval);
//   }, []);

//   const handleAddCenter = async () => {
//     if (!newCenter.name || !newCenter.location) return;
//     await addCenter(newCenter);
//     setNewCenter({ name: "", location: "" });
//   };

//   return (
//     <div className="centers-management">
//       <h2>Centers Management</h2>

//       {error && <div className="error-message">{error}</div>}

//       <div>
//         <h3>Add New Center</h3>
//         <input
//           type="text"
//           placeholder="Name"
//           value={newCenter.name}
//           onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Location"
//           value={newCenter.location}
//           onChange={(e) =>
//             setNewCenter({ ...newCenter, location: e.target.value })
//           }
//         />
//         <button onClick={handleAddCenter}>Add Center</button>
//       </div>

//       <h3>Centers List</h3>
//       <ul>
//         {loading ? (
//           <p>Loading centers...</p>
//         ) : centers.length > 0 ? (
//           centers.map((center) => (
//             <li key={center.id}>
//               {center.name} - {center.location}
//               <button onClick={() => handleDeleteCenter(center.id)}>
//                 Delete
//               </button>
//             </li>
//           ))
//         ) : (
//           <p>No centers available.</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default CentersManagement;





import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useCenterStore } from "../../Store";

const CentersManagement = () => {
  const [newCenter, setNewCenter] = useState({ 
    name: "", 
    location: "",
    description: "",
    capacity: "",
    contactEmail: "",
    contactPhone: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const formRef = useRef(null);

  const {
    centers,
    fetchCenters,
    addCenter,
    updateCenter,
    deleteCenter,
    loading,
    error,
    setError
  } = useCenterStore();

  useEffect(() => {
    fetchCenters();
    const interval = setInterval(() => {
      useCenterStore.getState().fetchCenters();
    }, 15 * 60 * 1000); // 15 min refresh

    return () => clearInterval(interval);
  }, []);

  const handleAddCenter = async () => {
    if (!newCenter.name || !newCenter.location) {
      setError("Name and Location are required");
      return;
    }
    await addCenter(newCenter);
    setNewCenter({ 
      name: "", 
      location: "",
      description: "",
      capacity: "",
      contactEmail: "",
      contactPhone: ""
    });
    formRef.current?.reset();
  };

  const handleUpdateCenter = async () => {
    if (!newCenter.name || !newCenter.location) {
      setError("Name and Location are required");
      return;
    }
    await updateCenter(editingId, newCenter);
    setEditingId(null);
    setNewCenter({ 
      name: "", 
      location: "",
      description: "",
      capacity: "",
      contactEmail: "",
      contactPhone: ""
    });
  };

  const handleEditCenter = (center) => {
    setEditingId(center.id);
    setNewCenter({
      name: center.name,
      location: center.location,
      description: center.description || "",
      capacity: center.capacity || "",
      contactEmail: center.contactEmail || "",
      contactPhone: center.contactPhone || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCenter = async (id) => {
    if (window.confirm("Are you sure you want to delete this center?")) {
      await deleteCenter(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewCenter({ 
      name: "", 
      location: "",
      description: "",
      capacity: "",
      contactEmail: "",
      contactPhone: ""
    });
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-purple-800">Centers Management</h2>

      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-purple-800">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Center" : "Add New Center"}
        </h3>
        <form ref={formRef} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center Name *
              </label>
              <input
                type="text"
                placeholder="Enter center name"
                value={newCenter.name}
                onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={newCenter.location}
                onChange={(e) => setNewCenter({ ...newCenter, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                value={newCenter.description}
                onChange={(e) => setNewCenter({ ...newCenter, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                placeholder="Enter capacity"
                value={newCenter.capacity}
                onChange={(e) => setNewCenter({ ...newCenter, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="Enter contact email"
                value={newCenter.contactEmail}
                onChange={(e) => setNewCenter({ ...newCenter, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="Enter contact phone"
                value={newCenter.contactPhone}
                onChange={(e) => setNewCenter({ ...newCenter, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={editingId ? handleUpdateCenter : handleAddCenter}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {editingId ? "Update Center" : "Add Center"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Centers List</h3>
          <div className="text-sm text-gray-500">
            {filteredCenters.length} {filteredCenters.length === 1 ? "center" : "centers"} found
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredCenters.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCenters.map((center) => (
                  <tr key={center.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{center.name}</div>
                      {center.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {center.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {center.location}
                      {center.capacity && (
                        <div className="text-xs text-gray-400 mt-1">
                          Capacity: {center.capacity}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {center.contactEmail && (
                        <div className="text-purple-600">{center.contactEmail}</div>
                      )}
                      {center.contactPhone && (
                        <div>{center.contactPhone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditCenter(center)}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCenter(center.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? "No centers match your search." : "No centers available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CentersManagement;









