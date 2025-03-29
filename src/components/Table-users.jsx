import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Table() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || ""
  );
  const [page, setPage] = useState(1);
  const usersPerPage = 150;

  const tokenRef = useRef(token);

  useEffect(() => {
    tokenRef.current = token;
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  const refreshAuthToken = async () => {
    try {
      console.log("🔄 Обновление токена...");
      const response = await axios.post(
        "http://18.141.233.37:4000/api/users/refreshToken",
        { refreshToken: tokenRef.current }
      );
      const newToken = response.data.accessToken;
      console.log("✅ Новый токен получен:", newToken);
      setToken(newToken);
      tokenRef.current = newToken;
      localStorage.setItem("authToken", newToken);
      fetchUsers(newToken);
    } catch (error) {
      console.error(
        "❌ Ошибка обновления токена:",
        error.response?.data || error
      );
      localStorage.removeItem("authToken");
      setToken("");
    }
  };

  const fetchUsers = async (authToken = tokenRef.current) => {
    if (!authToken) {
      console.log("❌ Токен отсутствует. Запрашиваем новый...");
      return refreshAuthToken();
    }
    setLoading(true);
    try {
      const response = await axios.get("http://18.141.233.37:4000/api/users", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { take: usersPerPage, page, sortBy: "id", sortOrder: "ASC" },
      });
      console.log("✅ Данные пользователей получены:", response.data);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("❌ Ошибка при запросе пользователей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      refreshAuthToken();
    }
    const tokenInterval = setInterval(refreshAuthToken, 15 * 60 * 1000);
    return () => clearInterval(tokenInterval);
  }, [token, page]);

  const handleEdit = async (id) => {
    const newEmail = prompt("Введите новый email:");
    if (!newEmail) return;
    try {
      await axios.patch(
        `http://18.141.233.37:4000/api/users/${id}`,
        { email: newEmail },
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Ошибка обновления пользователя:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого пользователя?"))
      return;
    try {
      await axios.delete(`http://18.141.233.37:4000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Ошибка удаления пользователя:", error);
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const currentUsers = users.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse border border-gray-300">
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
                    src={user.image || "https://via.placeholder.com/40"}
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
