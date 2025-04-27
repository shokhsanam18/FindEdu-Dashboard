import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUserStore } from "../../Store";

const LineGraph = () => {
  const [data, setData] = useState([]);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const weeklyData = users.reduce((acc, user) => {
          const date = new Date(user.createdAt);
          const weekStart = getStartOfWeek(date);
          const week = formatDate(weekStart);
          acc[week] = (acc[week] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(weeklyData).map((week) => ({
          week,
          users: weeklyData[week],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadUsers();
  }, [fetchUsers]);

  const formatWeekLabel = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full p-4 bg-white shadow rounded-lg m-5">
      <h2 className="text-lg font-bold mb-2 text-center text-gray-800">
        User Growth
      </h2>
      <div className="w-full h-[250px] px-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
            <XAxis
              dataKey="week"
              label={{
                value: "Week",
                position: "insideBottomRight",
                offset: -5,
                className: "text-xs font-semibold text-gray-600",
              }}
              tickFormatter={formatWeekLabel}
              padding={{ right: 20 }}
            />
            <YAxis
              label={{
                value: "Users",
                angle: -90,
                position: "insideLeft",
                className: "text-xs font-semibold text-gray-600",
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#4A0072"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, stroke: "#4A0072", fill: "#fff" }}
              strokeDasharray="2000 2000"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraph;
