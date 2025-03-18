"use client";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { month: "Nov", users: 200, owners: 130, admins: 10 },
  { month: "Dec", users: 210, owners: 125, admins: 8 },
  { month: "Jan", users: 190, owners: 140, admins: 9 },
  { month: "Feb", users: 220, owners: 135, admins: 7 },
  { month: "Mar", users: 215, owners: 145, admins: 6 },
  { month: "Apr", users: 230, owners: 155, admins: 5 },
  { month: "May", users: 225, owners: 150, admins: 4 },
  { month: "Jun", users: 240, owners: 165, admins: 3 },
  { month: "Jul", users: 235, owners: 160, admins: 2 },
];

const pieData = [
  { name: "Users", value: 216, color: "#4B0082" },
  { name: "Owners", value: 145, color: "#007BFF" },
  { name: "Admins", value: 6, color: "#00CCCC" },
];
export default function VisitorChart() {
  return (
    <div className="flex flex-col md:flex-row gap-4 m-5">
      <Card className="w-full md:w-1/2 p-6 shadow-xl">
        <CardBody>
          <Typography variant="h5" className="mb-2 font-semibold text-gray-700">
            Visitor Statistics
          </Typography>
          <Typography variant="small" className="text-gray-500">
            Nov - July
          </Typography>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4B0082"
                  strokeWidth={2}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="owners"
                  stroke="#007BFF"
                  strokeWidth={2}
                  name="Owners"
                />
                <Line
                  type="monotone"
                  dataKey="admins"
                  stroke="#00CCCC"
                  strokeWidth={2}
                  name="Admins"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Pie Chart */}
      <Card className="w-full md:w-1/2">
        <CardBody className="grid place-items-center px-4">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            User Distribution
          </Typography>
          <ResponsiveContainer width={300} height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}
