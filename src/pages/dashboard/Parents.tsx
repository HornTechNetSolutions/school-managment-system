"use client";

import React, { useState } from "react";
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const parents = [
  {
    id: "PRT-001",
    name: "Robert Thompson",
    relationship: "Father",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    phone: "+1 (555) 123-4567",
    email: "r.thompson@email.com",
    children: [
      { name: "Emma", grade: "Gr 10" },
    ],
  },
  {
    id: "PRT-002",
    name: "Maria Rodriguez",
    relationship: "Mother",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    phone: "+1 (555) 234-5678",
    email: "m.rodriguez@email.com",
    children: [
      { name: "James", grade: "Gr 9" },
      { name: "Sofia", grade: "Gr 7" },
    ],
  },
  {
    id: "PRT-003",
    name: "David Chen",
    relationship: "Father",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    phone: "+1 (555) 345-6789",
    email: "d.chen@email.com",
    children: [
      { name: "Sophia", grade: "Gr 11" },
    ],
  },
  {
    id: "PRT-004",
    name: "Sarah Williams",
    relationship: "Mother",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    phone: "+1 (555) 456-7890",
    email: "s.williams@email.com",
    children: [
      { name: "Michael", grade: "Gr 8" },
      { name: "Emily", grade: "Gr 5" },
    ],
  },
  {
    id: "PRT-005",
    name: "Carlos Martinez",
    relationship: "Father",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    phone: "+1 (555) 567-8901",
    email: "c.martinez@email.com",
    children: [
      { name: "Olivia", grade: "Gr 12" },
    ],
  },
  {
    id: "PRT-006",
    name: "Jennifer Anderson",
    relationship: "Mother",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    phone: "+1 (555) 678-9012",
    email: "j.anderson@email.com",
    children: [
      { name: "William", grade: "Gr 10" },
      { name: "Ava", grade: "Gr 8" },
      { name: "Lucas", grade: "Gr 6" },
    ],
  },
];

const Parents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParents = parents.filter((parent) =>
    parent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parents</h1>
          <p className="text-muted-foreground">Manage parent and guardian contacts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Parent
        </Button>
      </div>

      {/* Search */}
      <div className="bg-card border rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search parents..."
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
                <th>Parent / Guardian</th>
                <th>Contact</th>
                <th>Children</th>
                <th className="w-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.map((parent) => (
                <tr key={parent.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={parent.avatar} />
                        <AvatarFallback>{parent.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-foreground block">{parent.name}</span>
                        <span className="text-sm text-muted-foreground">{parent.relationship}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{parent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{parent.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      {parent.children.map((child, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {child.name} | {child.grade}
                        </span>
                      ))}
                    </div>
                  </td>
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
                          View Details
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

export default Parents;
