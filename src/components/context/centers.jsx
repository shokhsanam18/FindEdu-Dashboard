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
import { useCenterStore, useAuthStore } from "../../Store";
import { toast } from "sonner";

const CentersManagement = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (center) => {
    setSelectedCenter(center);
    setIsModalOpen(true);
  };

  const updateCenter = async (centerData) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("TOKEN >>>", token);
      console.log("Yuborilayotgan data:", centerData);

      if (!token) {
        console.error("Token yo'q!");
        return;
      }
      const payload = {
        name: centerData.name,
        address: centerData.address,
        phone: centerData.phone,
        image: centerData.image,
      };

      await axios.patch(
        `https://findcourse.net.uz/api/centers/${centerData.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCenters();
    } catch (err) {
      console.error("Update failed", err);
      console.error("Update failed", err.response?.data || err.message);
    }
  };

  const handleSave = (updatedCenter) => {
    updateCenter(updatedCenter);
    setIsModalOpen(false);
  };

  const { centers, fetchCenters, deleteCenter, loading, error } =
    useCenterStore();
  const { refreshTokenFunc } = useAuthStore();
  const [deletingIds, setDeletingIds] = useState([]);

  useEffect(() => {
    fetchCenters();

    const tokenInterval = setInterval(() => {
      refreshTokenFunc();
    }, 15 * 60 * 1000);

    return () => clearInterval(tokenInterval);
  }, [fetchCenters, refreshTokenFunc]);

  const handleDelete = async (id) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      const success = await deleteCenter(id);
      if (success) {
        toast.success("Center deleted successfully");
      } else {
        toast.error("Failed to delete center");
      }
    } catch (err) {
      toast.error("An error occurred while deleting");
      console.error("Delete error:", err);
    } finally {
      setDeletingIds((prev) => prev.filter((item) => item !== id));
    }
  };

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

  return (
    <Card className="mt-6 p-4 overflow-hidden">
      <Typography variant="h4" color="blue-gray">
        O'quv Markazlari
      </Typography>
      {error && <Typography color="red">{error}</Typography>}
      <CardBody className="overflow-auto p-0">
        {loading ? (
          <Spinner className="mx-auto my-10" />
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b p-4">Nomi</th>
                <th className="border-b p-4">Joylashuvi</th>
                <th className="border-b p-4">Raqami</th>
                <th className="border-b p-4">Viloyat</th>
                <th className="border-b p-4">Yo'nalishi</th>
                <th className="border-b p-4">Bajarish</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center.id}>
                  <td className="border-b p-4 text-black">
                    {renderCellWithPopover(center.name)}
                  </td>
                  <td className="border-b p-4 w-[100px]">
                    {renderCellWithPopover(center.address)}
                  </td>
                  <td className="border-b p-4">
                    {renderCellWithPopover(center.phone)}
                  </td>
                  <td className="border-b p-4">
                    {renderCellWithPopover(center.regionId)}
                  </td>
                  <td className="border-b p-4">
                    {renderCellWithPopover(center.majorsId)}
                  </td>
                  <td className="border-b p-4 flex gap-5">
                    <IconButton
                      color="amber"
                      className="hover:shadow-md hover:shadow-yellow-600"
                      onClick={() => handleEdit(center)}
                    >
                      <Edit className="h-5 w-5" />
                    </IconButton>
                    <IconButton
                      color="red"
                      onClick={() => handleDelete(center.id)}
                      disabled={deletingIds.includes(center.id)}
                    >
                      {deletingIds.includes(center.id) ? (
                        <Spinner className="h-5 w-5" />
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
      <Modal
        center={selectedCenter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </Card>
  );
};

export default CentersManagement;
