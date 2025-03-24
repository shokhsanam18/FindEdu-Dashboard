import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Table() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyODIzMDMwLCJleHAiOjE3NDI4MjY2MzB9.Wskq9ShVSGjWXc33oWjVVpDEjid-wVWF3Db9XgtxvKo"
  );

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
      console.log("Token обновлен:", newToken);

      fetchUsers(newToken);
    } catch (error) {
      console.error("Ошибка обновления токена:", error.response?.data || error);
    }
  };

  const fetchUsers = async (authToken = tokenRef.current) => {
    setLoading(true);
    try {
      const response = await axios.get("http://18.141.233.37:4000/api/users", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("API Response:", response.data);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const tokenInterval = setInterval(refreshAuthToken, 15 * 60 * 1000);

    return () => clearInterval(tokenInterval);
  }, []); 

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
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
