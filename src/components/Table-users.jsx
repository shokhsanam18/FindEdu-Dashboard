import { useEffect, useState, useRef } from "react";
import axios from "axios";  
import { useUserStore, useAuthStore } from "../Store";

function Table() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const usersPerPage = 150;

  const [imageMap, setImageMap] = useState({}); // store blob URLs by user ID

  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const editUser = useUserStore((state) => state.editUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const fetchProfileImage = useAuthStore((state) => state.fetchProfileImage);

  // Load users on mount / page change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchUsers(page, usersPerPage);
      setUsers(data);
      setLoading(false);

      localStorage.setItem("userNames", JSON.stringify(data));
      
      // Fetch blob URLs for user images
      for (const user of data) {
        if (user.image && !imageMap[user.id]) {
          const blobUrl = await fetchProfileImage(user.image);
          setImageMap((prev) => ({ ...prev, [user.id]: blobUrl }));
        }
      }
    };

    load();
  }, [page, fetchUsers]);

  const handleEdit = async (id) => {
    const newEmail = prompt("Введите новый email:");
    if (!newEmail) return;
    await editUser(id, newEmail);
    const data = await fetchUsers(page, usersPerPage);
    setUsers(data);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить этого пользователя?");
    if (!confirmed) return;
    await deleteUser(id);
    const data = await fetchUsers(page, usersPerPage);
    setUsers(data);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const currentUsers = users.slice((page - 1) * usersPerPage, page * usersPerPage);


  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Password</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.firstName}</td>
                <td className="border p-2">{user.lastName}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.role || "N/A"}</td>
                <td className="border p-2">******</td>
                <td className="border p-2">
                  <img
                    src={imageMap[user.id] || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="p-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
