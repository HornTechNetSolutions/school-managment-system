"use client";

import React from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import FinanceChart from "@/components/dashboard/FinanceChart";

const transactions = [
  { id: 1, description: "Tuition Payment - Emma Thompson", amount: 2500, type: "income", date: "Feb 10, 2024" },
  { id: 2, description: "Lab Equipment Purchase", amount: -850, type: "expense", date: "Feb 9, 2024" },
  { id: 3, description: "Sports Day Event Sponsorship", amount: 5000, type: "income", date: "Feb 8, 2024" },
  { id: 4, description: "Staff Salary - February", amount: -45000, type: "expense", date: "Feb 7, 2024" },
  { id: 5, description: "Library Book Donation", amount: 1200, type: "income", date: "Feb 6, 2024" },
];

const stats = [
  { title: "Total Revenue", value: "$328.5K", icon: DollarSign, trend: { value: "+18%", isPositive: true }, iconColor: "bg-green-100 text-green-600" },
  { title: "Total Expenses", value: "$145.2K", icon: CreditCard, trend: { value: "+5%", isPositive: false }, iconColor: "bg-red-100 text-red-600" },
  { title: "Net Profit", value: "$183.3K", icon: TrendingUp, trend: { value: "+24%", isPositive: true }, iconColor: "bg-blue-100 text-blue-600" },
  { title: "Pending Fees", value: "$42.8K", icon: Receipt, iconColor: "bg-amber-100 text-amber-600" },
];

const Finance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Finance</h1>
        <p className="text-muted-foreground">Track income, expenses and financial reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Chart */}
      <FinanceChart />

      {/* Recent Transactions */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                  {tx.type === "income" ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                {tx.type === "income" ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finance;
