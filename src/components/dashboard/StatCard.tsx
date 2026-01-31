"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = "bg-primary/10 text-primary",
}) => {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.isPositive ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={cn("text-sm font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
            {trend.value}
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
