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
import { useCenterStore } from "../../Store";

const CentersManagements = () => {
  const [data, setData] = useState([]);
  const { centers, fetchCenters } = useCenterStore();

  useEffect(() => {
    const loadCenters = async () => {
      await fetchCenters();
      const chartData = centers.map((center) => ({
        name: center.name,
        count: center.id,
      }));
      setData(chartData);
    };

    loadCenters();
  }, [fetchCenters, centers]);

  return (
    <div className="w-full p-4 bg-white shadow rounded-lg m-5">
      <h2 className="text-lg font-bold mb-2 text-center text-gray-800">
        Centers Overview
      </h2>
      <div className="w-full h-[250px] px-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
            <XAxis
              dataKey="name"
              label={{
                value: "Centers",
                position: "insideBottomRight",
                offset: -5,
                className: "text-xs font-semibold text-gray-600",
              }}
              tickFormatter={(name) => name}
              padding={{ right: 20 }}
            />
            <YAxis
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                className: "text-xs font-semibold text-gray-600",
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
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

export default CentersManagements;
