// src/pages/Dashboard.jsx

import React from "react";
import Card from "./Card";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

const Dashboard = () => {
  return (
    <div className="space-y-6 px-6">
      {/* Kartu Statistik */}
      <Card />

      {/* Line Chart - Layer Kedua */}
      <div className="w-full">
        <LineChart />
      </div>

      {/* Pie Chart - Layer Ketiga */}
      <div className="w-full">
        <PieChart />
      </div>
    </div>
  );
};

export default Dashboard;
