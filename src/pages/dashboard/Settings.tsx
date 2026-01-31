"use client";

import React from "react";
import { User, Bell, Shield, Palette, Database, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const settingsSections = [
  { icon: User, label: "Profile", id: "profile" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Shield, label: "Security", id: "security" },
  { icon: Palette, label: "Appearance", id: "appearance" },
  { icon: Database, label: "Data", id: "data" },
  { icon: HelpCircle, label: "Help", id: "help" },
];

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <section.icon className="w-5 h-5" />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="James" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Wilson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="james.wilson@edumanage.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
            
            <div className="mt-6">
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email updates about school activities</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about urgent matters</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
