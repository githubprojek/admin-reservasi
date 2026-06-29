// src/pages/Card.jsx

import { useEffect } from "react";
import { useDashboardStore } from "./useDashboardStore.js";
import { UserCog, Hotel, BedDouble, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

const Card = () => {
  const { stats, loading, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const cards = [
    {
      title: "Jumlah Hotel",
      value: stats.totalHotel,
      icon: Hotel,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Jumlah Room",
      value: stats.totalRoom,
      icon: BedDouble,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Jumlah Staff",
      value: stats.totalStaff,
      icon: UserCog,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      title: "Total Reservasi",
      value: stats.totalReservasi,
      icon: CalendarCheck,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  if (loading) return <div className="text-center mt-10 text-lg">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-6">
      <div className="bg-white dark:bg-base-200 rounded-3xl shadow-md p-6">
        <div className="flex justify-between text-center">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="flex-1 flex items-center justify-center relative px-4">
                {/* Icon kiri */}
                <div className={`p-3 rounded-xl ${card.bg} mr-3`}>
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>

                {/* Teks */}
                <div className="text-left">
                  <div className="text-sm text-gray-500 font-medium mb-1">{card.title}</div>
                  <div className="text-2xl font-semibold text-gray-800 dark:text-white">{card.value}</div>
                </div>

                {/* Garis pembatas */}
                {idx !== cards.length - 1 && <div className="absolute top-[10%] bottom-[10%] right-0 w-px bg-gray-300" />}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
