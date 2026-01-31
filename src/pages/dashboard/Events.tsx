"use client";

import React from "react";
import { Plus, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    title: "Parent-Teacher Conference",
    date: "February 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Main Hall",
    attendees: 450,
    color: "bg-primary",
    description: "Annual meeting between parents and teachers to discuss student progress.",
  },
  {
    id: 2,
    title: "Science Fair Exhibition",
    date: "February 20, 2024",
    time: "9:00 AM - 2:00 PM",
    location: "Science Building",
    attendees: 320,
    color: "bg-green-500",
    description: "Students showcase their science projects and experiments.",
  },
  {
    id: 3,
    title: "Annual Sports Day",
    date: "February 25, 2024",
    time: "8:00 AM - 5:00 PM",
    location: "Sports Complex",
    attendees: 1200,
    color: "bg-amber-500",
    description: "Inter-house sports competitions and athletic events.",
  },
  {
    id: 4,
    title: "Cultural Fest 2024",
    date: "March 5, 2024",
    time: "3:00 PM - 8:00 PM",
    location: "Auditorium",
    attendees: 800,
    color: "bg-purple-500",
    description: "Celebration of arts, music, dance and cultural performances.",
  },
  {
    id: 5,
    title: "Career Guidance Workshop",
    date: "March 10, 2024",
    time: "11:00 AM - 1:00 PM",
    location: "Conference Room",
    attendees: 150,
    color: "bg-cyan-500",
    description: "Career counseling session for Grade 11 and 12 students.",
  },
];

const Events: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">Manage school events and activities</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className={`w-16 h-16 ${event.color} rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0`}>
                <span className="text-xs font-medium">{event.date.split(" ")[0]}</span>
                <span className="text-2xl font-bold leading-none">{event.date.split(" ")[1].replace(",", "")}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} expected</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
