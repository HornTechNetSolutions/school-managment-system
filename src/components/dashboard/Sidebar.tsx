"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCircle,
  UsersRound,
  BookOpen,
  DollarSign,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Teachers", path: "/dashboard/teachers" },
  { icon: UserCircle, label: "Students", path: "/dashboard/students" },
  { icon: UsersRound, label: "Parents", path: "/dashboard/parents" },
  { icon: BookOpen, label: "Classes", path: "/dashboard/classes" },
  { icon: DollarSign, label: "Finance", path: "/dashboard/finance" },
  { icon: Calendar, label: "Events", path: "/dashboard/events" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-border z-50 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-foreground">EduManage</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback className="bg-muted text-foreground">JW</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">James Wilson</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          )}
          {!collapsed && (
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
