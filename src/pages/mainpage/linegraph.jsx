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

        // Group users by week of registration
        const weeklyData = users.reduce((acc, user) => {
          const week = moment(user.createdAt)
            .startOf("isoWeek")
            .format("YYYY-MM-DD");
          acc[week] = (acc[week] || 0) + 1;
          return acc;
        }, {});

        // Convert object to array for Recharts
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
      <h2 className="text-lg font-bold mb-2 text-center">User Growth</h2>
      <div className="w-full h-[250px] px-5">
        {" "}
        {/* Added horizontal padding */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              label={{
                value: "Week",
                position: "insideBottomRight",
                offset: -5,
                className: "text-xs",
              }}
              tickFormatter={(week) => moment(week).format("MMM DD")}
              padding={{ right: 20 }} // Added padding to prevent cut-off
            />
            <YAxis
              label={{
                value: "Users",
                angle: -90,
                position: "insideLeft",
                className: "text-xs",
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraph;
