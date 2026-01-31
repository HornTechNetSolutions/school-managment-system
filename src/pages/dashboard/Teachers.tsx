"use client";

import React, { useState } from "react";
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const teachers = [
  {
    id: "TCH-001",
    name: "Dr. Sarah Mitchell",
    email: "s.mitchell@edumanage.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    subjects: [
      { name: "Mathematics", color: "badge-math" },
      { name: "Physics", color: "badge-science" },
    ],
    classes: "10-A, 11-B, 12-A",
    status: "active",
  },
  {
    id: "TCH-002",
    name: "Prof. Michael Johnson",
    email: "m.johnson@edumanage.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    subjects: [
      { name: "Biology", color: "badge-science" },
    ],
    classes: "9-A, 10-B, 11-A",
    status: "active",
  },
  {
    id: "TCH-003",
    name: "Ms. Emily Davis",
    email: "e.davis@edumanage.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    subjects: [
      { name: "English", color: "badge-english" },
      { name: "History", color: "badge-history" },
    ],
    classes: "8-A, 9-B, 10-A",
    status: "active",
  },
  {
    id: "TCH-004",
    name: "Mr. Robert Wilson",
    email: "r.wilson@edumanage.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    subjects: [
      { name: "Art", color: "badge-art" },
    ],
    classes: "All Grades",
    status: "leave",
  },
  {
    id: "TCH-005",
    name: "Mrs. Jennifer Lee",
    email: "j.lee@edumanage.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    subjects: [
      { name: "PE", color: "badge-pe" },
    ],
    classes: "7-A, 8-A, 9-A",
    status: "active",
  },
];

const stats = [
  { label: "Total", value: 142, color: "bg-primary/10 text-primary" },
  { label: "Active", value: 138, color: "bg-green-100 text-green-700" },
  { label: "On Leave", value: 4, color: "bg-amber-100 text-amber-700" },
];

const Teachers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage your teaching staff</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn("px-4 py-2 rounded-full text-sm font-medium", stat.color)}
          >
            {stat.label}: {stat.value}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card border rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Subjects</th>
                <th>Classes Assigned</th>
                <th className="w-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback>{teacher.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-foreground block">{teacher.name}</span>
                        <span className="text-sm text-muted-foreground">{teacher.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{teacher.id}</span>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          teacher.status === "active" ? "status-active" : "status-leave"
                        )}
                      >
                        {teacher.status === "active" ? "Active" : "On Leave"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, idx) => (
                        <span key={idx} className={cn("badge-subject", subject.color)}>
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-muted-foreground">{teacher.classes}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
