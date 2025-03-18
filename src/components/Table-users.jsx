import { useEffect, useState } from "react";
import axios from "axios";

function Table() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://18.141.233.37:4000/api/users", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyMzA2MDYxLCJleHAiOjE3NDIzMDk2NjF9.S1Bgnq-T4zgTcUWKt5AU8H18W0ce0R5G-unmJEfRvfI`,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setUsers(response.data.data || []);
      })
      .catch((error) => console.error("Ошибка при запросе:", error))
      .finally(() => setLoading(false));
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
                <td className="border p-2">{user.password || "******"}</td>
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
