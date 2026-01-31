"use client";

import React from "react";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-foreground/5 rounded-full" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-primary-foreground/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-foreground/10 rounded-full blur-xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <span className="text-3xl font-bold text-primary-foreground">EduManage</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Streamline Your<br />School Management
          </h1>
          
          <p className="text-primary-foreground/80 text-lg max-w-md">
            A comprehensive platform for managing students, teachers, parents, 
            and all aspects of your educational institution.
          </p>
          
          {/* Features */}
          <div className="mt-12 space-y-4">
            {["Student & Teacher Management", "Finance Tracking", "Event Scheduling", "Parent Communication"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-primary-foreground/90">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 bg-card">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">EduManage</span>
        </div>
        
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
