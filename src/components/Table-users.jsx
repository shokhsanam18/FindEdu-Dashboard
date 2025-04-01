import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  IconButton,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useUserStore, useAuthStore } from "../Store";

const Table = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;
  const [imageMap, setImageMap] = useState({});

  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const editUser = useUserStore((state) => state.editUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const fetchProfileImage = useAuthStore((state) => state.fetchProfileImage);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchUsers(page, usersPerPage);
      setUsers(data);
      setLoading(false);

      localStorage.setItem("userNames", JSON.stringify(data));

      for (const user of data) {
        if (user.image && !imageMap[user.id]) {
          const blobUrl = await fetchProfileImage(user.image);
          setImageMap((prev) => ({ ...prev, [user.id]: blobUrl }));
        }
      }
    };

    load();
  }, [page, fetchUsers]);

  const renderCellWithPopover = (text) => (
    <Popover placement="bottom-start">
      <PopoverHandler>
        <Typography className="truncate w-full max-w-[150px] cursor-pointer inline-block">
          {text || "N/A"}
        </Typography>
      </PopoverHandler>
      <PopoverContent>{text || "N/A"}</PopoverContent>
    </Popover>
  );

  const handleEdit = async (id) => {
    const newEmail = prompt("Введите новый email:");
    if (!newEmail) return;
    await editUser(id, newEmail);
    const data = await fetchUsers(page, usersPerPage);
    setUsers(data);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этого пользователя?"
    );
    if (!confirmed) return;
    await deleteUser(id);
    const data = await fetchUsers(page, usersPerPage);
    setUsers(data);
  };

  return (
    <Card className="mt-6 p-4 overflow-hidden">
      <Typography variant="h4" color="blue-gray">
        Foydalanuvchilar
      </Typography>
      <CardBody className="overflow-auto p-0">
        {loading ? (
          <Spinner className="mx-auto my-10" />
        ) : (
          <>
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b p-4 w-1/9">ID</th>
                  <th className="border-b p-4 w-1/9">Ism</th>
                  <th className="border-b p-4 w-1/9">Familiya</th>
                  <th className="border-b p-4 w-1/9">Email</th>
                  <th className="border-b p-4 w-1/9">Telefon</th>
                  <th className="border-b p-4 w-1/9">Rol</th>
                  <th className="border-b p-4 w-1/9">Parol</th>
                  <th className="border-b p-4 w-1/9">Rasm</th>
                  <th className="border-b p-4 w-1/9 text-center">Bajarish</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      {renderCellWithPopover(user.id)}
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      {renderCellWithPopover(user.firstName)}
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      {renderCellWithPopover(user.lastName)}
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      {renderCellWithPopover(user.email)}
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      {renderCellWithPopover(user.phone)}
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      {renderCellWithPopover(user.role || "N/A")}
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      ******
                    </td>
                    <td className="border-b p-4 truncate max-w-[150px]">
                      <img
                        src={
                          imageMap[user.id] || "https://via.placeholder.com/40"
                        }
                        alt="User"
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </td>
                    <td className="border-b p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <IconButton
                          color="blue"
                          onClick={() => handleEdit(user.id)}
                        >
                          Edit
                        </IconButton>
                        <IconButton
                          color="red"
                          onClick={() => handleDelete(user.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                Prev
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Table;
