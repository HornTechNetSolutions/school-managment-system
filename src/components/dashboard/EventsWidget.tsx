"use client";

import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Parent-Teacher Conference",
    date: "Feb 15",
    time: "10:00 AM - 4:00 PM",
    location: "Main Hall",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Science Fair Exhibition",
    date: "Feb 20",
    time: "9:00 AM - 2:00 PM",
    location: "Science Building",
    color: "bg-success",
  },
  {
    id: 3,
    title: "Sports Day",
    date: "Feb 25",
    time: "8:00 AM - 5:00 PM",
    location: "Sports Complex",
    color: "bg-warning",
  },
  {
    id: 4,
    title: "Annual Cultural Fest",
    date: "Mar 5",
    time: "3:00 PM - 8:00 PM",
    location: "Auditorium",
    color: "bg-purple-500",
  },
];

const EventsWidget: React.FC = () => {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${event.color} rounded-xl flex flex-col items-center justify-center text-white`}>
                <span className="text-xs font-medium">{event.date.split(" ")[0]}</span>
                <span className="text-lg font-bold leading-none">{event.date.split(" ")[1]}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{event.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsWidget;
