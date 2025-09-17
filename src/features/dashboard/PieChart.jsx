import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useStoreRoom from "../room/useStoreRoom";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { roomList, fetchRoom } = useStoreRoom();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Pastikan data room dimuat hanya sekali saat kosong
    if (!roomList || roomList.length === 0) {
      fetchRoom(true); // true = force fetch semua data
    }
  }, []);

  useEffect(() => {
    if (!roomList || roomList.length === 0) return;

    let penuh = 0;
    let hampirPenuh = 0;
    let kosong = 0;

    roomList.forEach((room) => {
      const available = room.availableRoom ?? 0;
      if (available === 0) penuh++;
      else if (available <= 2) hampirPenuh++;
      else kosong++;
    });

    const data = {
      labels: ["Room Penuh", "Hampir Penuh", "Masih Kosong"],
      datasets: [
        {
          label: "Ketersediaan Kamar",
          data: [penuh, hampirPenuh, kosong],
          backgroundColor: ["#ef4444", "#facc15", "#22c55e"],
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [roomList]);

  if (!chartData) return <div className="text-center mt-10">Loading chart...</div>;

  return (
    <div className="bg-white dark:bg-base-200 rounded-2xl shadow-md p-6 mx-6 mt-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Statistik Ketersediaan Kamar</h2>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#4b5563",
                font: { size: 14 },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
