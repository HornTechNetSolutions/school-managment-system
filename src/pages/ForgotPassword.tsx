"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className="max-w-sm animate-fade-in">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Account Recovery"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="admin@edumanage.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <Button type="submit" variant="auth" className="w-full">
          Send Reset Link
        </Button>

        <Link to="/" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
