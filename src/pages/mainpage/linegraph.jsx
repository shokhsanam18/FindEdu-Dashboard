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
import moment from "moment";

const LineGraph = () => {
  const [data, setData] = useState([]);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const weeklyData = users.reduce((acc, user) => {
          const week = moment(user.createdAt)
            .startOf("isoWeek")
            .format("YYYY-MM-DD");
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
              tickFormatter={(week) => moment(week).format("MMM DD")}
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
              stroke="#4A0072" // Matching dashboard theme
              strokeWidth={3} // Thicker line
              dot={{ r: 4, strokeWidth: 2, stroke: "#4A0072", fill: "#fff" }} // Styled dots
              strokeDasharray="2000 2000" // Animation effect
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraph;
