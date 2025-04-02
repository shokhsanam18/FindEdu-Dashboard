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
import { useCenterStore } from "../../Store";
import { useAuthStore } from "../../Store";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CentersManagements = () => {
  const { centers, fetchCenters, deleteCenter, loading, error } =
    useCenterStore();
  const { refreshTokenFunc } = useAuthStore();
  const [page, setPage] = useState(1);
  const centersPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadCenters = async () => {
      await fetchCenters(page, centersPerPage);
      setTotalPages(Math.ceil(centers.length / centersPerPage));
    };
    loadCenters();
    const tokenInterval = setInterval(() => refreshTokenFunc(), 15 * 60 * 1000);
    return () => clearInterval(tokenInterval);
  }, [fetchCenters, refreshTokenFunc, page]);

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

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Centers Growth (Example)",
        data: [5, 10, 7, 15, 20, 18, 25], 
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Centers Growth Over Time",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <Card className="mt-6 p-4 overflow-hidden">
      <Typography variant="h4" color="blue-gray">
        O'quv Markazlari
      </Typography>
      {error && <Typography color="red">{error}</Typography>}

      {/* Line Chart */}
      <div className="mt-6">
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      <CardBody className="overflow-auto p-0 mt-6">
        {loading ? <Spinner className="mx-auto my-10" /> : <></>}
      </CardBody>
    </Card>
  );
};

export default CentersManagements;
