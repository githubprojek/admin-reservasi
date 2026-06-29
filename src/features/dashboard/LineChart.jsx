import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDashboardStore } from "../dashboard/useDashboardStore";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function generateDateRange(startDate, endDate) {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const isoDate = currentDate.toISOString().split("T")[0];
    dateArray.push(isoDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

const LineChart = () => {
  const { historyCheckoutList, fetchDashboardData } = useDashboardStore();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!historyCheckoutList || historyCheckoutList.length === 0) return;

    // Ambil hari ini dan 30 hari sebelumnya
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7); // 30 hari termasuk hari ini

    const fullDateRange = generateDateRange(startDate, today);

    // Hitung jumlah checkout per tanggal
    const countPerDate = {};
    historyCheckoutList.forEach((item) => {
      const tanggal = new Date(item.checkOut).toISOString().split("T")[0];
      if (tanggal >= fullDateRange[0] && tanggal <= fullDateRange[fullDateRange.length - 1]) {
        countPerDate[tanggal] = (countPerDate[tanggal] || 0) + 1;
      }
    });

    const data = {
      labels: fullDateRange,
      datasets: [
        {
          label: "Checkout 30 Hari Terakhir",
          data: fullDateRange.map((date) => countPerDate[date] || 0),
          fill: false,
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          tension: 0.4,
        },
      ],
    };

    setChartData(data);
  }, [historyCheckoutList]);

  if (!chartData) return <div className="text-center mt-10">Loading chart...</div>;

  return (
    <div
      className="bg-white dark:bg-base-200 rounded-2xl shadow-md p-6 mx-6 mt-6"
      style={{ height: 400 }} // ⬅️ Atur tinggi di sini, contoh: 250 / 300 / 400
    >
      <h2 className="text-xl font-semibold mb-4">Checkout 7 Hari Terakhir</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false, // ⬅️ PENTING agar tinggi dari div bisa bekerja
          plugins: {
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        }}
      />
    </div>
  );
};

export default LineChart;
