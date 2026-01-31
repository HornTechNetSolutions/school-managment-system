"use client";

import React from "react";
import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import FinanceChart from "@/components/dashboard/FinanceChart";
import EventsWidget from "@/components/dashboard/EventsWidget";

const stats = [
  {
    title: "Total Students",
    value: "2,847",
    icon: GraduationCap,
    trend: { value: "+12%", isPositive: true },
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Teachers",
    value: "142",
    icon: Users,
    trend: { value: "+5%", isPositive: true },
    iconColor: "bg-green-100 text-green-600",
  },
  {
    title: "Active Classes",
    value: "86",
    icon: BookOpen,
    trend: { value: "+8%", isPositive: true },
    iconColor: "bg-purple-100 text-purple-600",
  },
  {
    title: "Revenue",
    value: "$328.5K",
    icon: DollarSign,
    trend: { value: "+18%", isPositive: true },
    iconColor: "bg-amber-100 text-amber-600",
  },
];

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, James. Here's what's happening today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinanceChart />
        </div>
        <div>
          <EventsWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
