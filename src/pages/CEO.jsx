import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

const useCeoStore = create((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));

const API_URL = "http://18.141.233.37:4000/api";

const fetchCenters = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export default function CEO() {
  const queryClient = useQueryClient();
  const { search, setSearch } = useCeoStore();
  const [newCenter, setNewCenter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["centers"],
    queryFn: fetchCenters,
  });

  const addMutation = useMutation({
    mutationFn: (newItem) => axios.post(API_URL, { name: newItem }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["centers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["centers"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => axios.put(`${API_URL}/${id}`, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["centers"] }),
  });

  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="mt-6 p-4">
      <Typography variant="h4" color="blue-gray">
        O'quv Markazlari{" "}
      </Typography>

      <div className="flex gap-4 my-4">
        <Input
          label="Добавить центр"
          value={newCenter}
          onChange={(e) => setNewCenter(e.target.value)}
        />
        <Button
          onClick={() => {
            if (newCenter.trim()) {
              addMutation.mutate(newCenter);
              setNewCenter("");
            }
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" /> Qo'shish
        </Button>
      </div>

      <Input
        label="Поиск по центрам"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <CardBody className="overflow-x-auto p-0">
        {isLoading ? (
          <Spinner className="mx-auto my-10" />
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b p-4">Nomi</th>
                <th className="border-b p-4 text-right">Bajarish</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((center) => (
                <CenterRow
                  key={center.id}
                  center={center}
                  deleteMutation={deleteMutation}
                  updateMutation={updateMutation}
                />
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
}

function CenterRow({ center, deleteMutation, updateMutation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(center.name);

  return (
    <tr>
      <td className="border-b p-4">
        {isEditing ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          <Typography>{center.name}</Typography>
        )}
      </td>
      <td className="border-b p-4 text-right space-x-2">
        {isEditing ? (
          <Button
            size="sm"
            onClick={() => {
              updateMutation.mutate({ id: center.id, name: editedName });
              setIsEditing(false);
            }}
          >
            Saqlash
          </Button>
        ) : (
          <IconButton onClick={() => setIsEditing(true)}>
            <PencilIcon className="h-5 w-5" />
          </IconButton>
        )}
        <IconButton
          color="red"
          onClick={() => deleteMutation.mutate(center.id)}
        >
          <TrashIcon className="h-5 w-5" />
        </IconButton>
      </td>
    </tr>
  );
}
