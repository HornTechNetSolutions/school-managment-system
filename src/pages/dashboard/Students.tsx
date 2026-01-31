"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Download, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddStudentModal from "@/components/dashboard/AddStudentModal";

const students = [
  {
    id: "STU-001",
    name: "Emma Thompson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    status: "Active",
    class: "Grade 10 - A",
    parentName: "Robert Thompson",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "STU-002",
    name: "James Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    status: "Active",
    class: "Grade 9 - B",
    parentName: "Maria Rodriguez",
    phone: "+1 (555) 234-5678",
  },
  {
    id: "STU-003",
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    status: "Active",
    class: "Grade 11 - A",
    parentName: "David Chen",
    phone: "+1 (555) 345-6789",
  },
  {
    id: "STU-004",
    name: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "Inactive",
    class: "Grade 8 - C",
    parentName: "Sarah Brown",
    phone: "+1 (555) 456-7890",
  },
  {
    id: "STU-005",
    name: "Olivia Martinez",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    status: "Active",
    class: "Grade 12 - A",
    parentName: "Carlos Martinez",
    phone: "+1 (555) 567-8901",
  },
  {
    id: "STU-006",
    name: "William Anderson",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    status: "Active",
    class: "Grade 10 - B",
    parentName: "Jennifer Anderson",
    phone: "+1 (555) 678-9012",
  },
];

const Students: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class.includes(classFilter);
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage your student records</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Grade 8">Grade 8</SelectItem>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="Grade 11">Grade 11</SelectItem>
                <SelectItem value="Grade 12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID / Status</th>
                <th>Class</th>
                <th>Parent Name</th>
                <th>Phone</th>
                <th className="w-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-sm">{student.id}</span>
                      <Badge variant={student.status === "Active" ? "default" : "secondary"} className="ml-0 block w-fit">
                        {student.status}
                      </Badge>
                    </div>
                  </td>
                  <td>{student.class}</td>
                  <td>{student.parentName}</td>
                  <td className="text-muted-foreground">{student.phone}</td>
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
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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

      <AddStudentModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Students;
