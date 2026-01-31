"use client";

import React from "react";
import { Plus, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const classes = [
  { id: 1, name: "Grade 10 - A", students: 32, teacher: "Dr. Sarah Mitchell", subjects: ["Math", "Physics", "English"] },
  { id: 2, name: "Grade 10 - B", students: 30, teacher: "Prof. Michael Johnson", subjects: ["Math", "Biology", "History"] },
  { id: 3, name: "Grade 11 - A", students: 28, teacher: "Ms. Emily Davis", subjects: ["English", "History", "Art"] },
  { id: 4, name: "Grade 11 - B", students: 31, teacher: "Dr. Sarah Mitchell", subjects: ["Math", "Physics", "Chemistry"] },
  { id: 5, name: "Grade 12 - A", students: 25, teacher: "Mrs. Jennifer Lee", subjects: ["PE", "Biology", "Math"] },
  { id: 6, name: "Grade 9 - A", students: 34, teacher: "Mr. Robert Wilson", subjects: ["Art", "English", "History"] },
];

const Classes: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage class sections and assignments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                {cls.students} students
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-1">{cls.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">Class Teacher: {cls.teacher}</p>
            
            <div className="flex flex-wrap gap-1.5">
              {cls.subjects.map((subject, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
