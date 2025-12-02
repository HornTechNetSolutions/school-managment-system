import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.ts"
import { signAccessToken, signRefreshToken,verifyRefreshToken } from  "../utils/jwt.ts"


export const signup= async (req: Request, res: Response)=>{
    const {
        fullName, 
        email, 
        studentNumber, 
        employeeNumber, role, password, confirmPassword, parentNumber, 
        employeeRole, 
        department,
        title,}= req.body;
    try {
        console.log("Signup body:", req.body);

        if(!fullName || !email || !password || !confirmPassword || !role){
            return res.status(400).json({success: false, message: "All fields required"})
        };

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        };

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({ success: false, message: "Invalid email" });
        };
        
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)){
            return res.status(400).json({ 
                message:"Password must be at least 8 characters long, include upper & lowercase letters, a number, and a special character."
            });
        };

        const existingEmail= await prisma.users.findUnique({
            where: {email}
        });

        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        };

        if (role === "STUDENT" && studentNumber) {
            const existingStudent = await prisma.users.findUnique({
              where: { studentNumber: studentNumber },
            });
      
            if (existingStudent) {
              return res
                .status(400)
                .json({ message: "Student number already used" });
            }
        };

        if (role === "EMPLOYEE" && employeeNumber) {
            const existingEmployee = await prisma.users.findUnique({
                where: { employeeNumber: employeeNumber },
            });
    
            if (existingEmployee) {
                return res
                    .status(400)
                    .json({ message: "Employee number already used" });
            };
        };

        if (role === "PARENT" && parentNumber) {
            const existingParent = await prisma.users.findUnique({
              where: { parentNumber: parentNumber },
            });
            if (existingParent) {
              return res
                .status(400)
                .json({ message: "Parent number already used" });
            }
        }

        const salt= await bcrypt.genSalt(12)
        const hashedPassword= await bcrypt.hash(password,salt);
        
        let newUser;

        switch (role.toUpperCase()) {
            case "STUDENT":
              if (!studentNumber)
                return res
                  .status(400)
                  .json({ message: "Student number required for students" });
      
              newUser = await prisma.users.create({
                data: {
                  fullName: fullName,
                  email,
                  password: hashedPassword,
                  role: "STUDENT",
                  studentNumber,
                  student: { create: {} },
                },
                include: { student: true },
              });
              break;
      
            case "EMPLOYEE":
              if (!employeeNumber)
                return res
                  .status(400)
                  .json({ message: "Employee number required for employees" });
      
              if (!employeeRole)
                return res
                  .status(400)
                  .json({ message: "Employee role required" });
      
              newUser = await prisma.users.create({
                data: {
                  fullName: name,
                  email,
                  password: hashedPassword,
                  role: "EMPLOYEE",
                  employeeNumber,
                  employee: {
                    create: {
                      role: employeeRole,
                      department: department || null,
                      title: title || null,
                    },
                  },
                },
                include: { employee: true },
              });
              break;
      
            case "PARENT":
              if (!parentNumber)
                return res
                  .status(400)
                  .json({ message: "Parent number required" });
      
              newUser = await prisma.users.create({
                data: {
                  fullName: name,
                  email,
                  password: hashedPassword,
                  role: "PARENT",
                  parentNumber,
                  parent: { create: {} },
                },
                include: { parent: true },
              });
              break;
      
            case "TEACHER":
              newUser = await prisma.users.create({
                data: {
                  fullName: name,
                  email,
                  password: hashedPassword,
                  role: "TEACHER",
                  teacher: { create: {} },
                },
                include: { teacher: true },
              });
              break;
      
            case "ADMIN":
              newUser = await prisma.users.create({
                data: {
                  fullName: name,
                  email,
                  password: hashedPassword,
                  role: "ADMIN",
                  admin: { create: {} },
                },
                include: { admin: true },
              });
              break;
      
            default:
              return res.status(400).json({ message: "Invalid role" });
        }

        const accessToken = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { userId: newUser.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        await prisma.refreshToken.create({
            data: {
              token: refreshToken,
              userId: newUser.id,
            },
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // set true in production
            sameSite: "lax", // or "none" for cross-site
            path: "/",
        });
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: newUser,
             accessToken,
             refreshToken,
        });
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login= async (req: Request, res: Response)=>{
    try {
        const {password, studentNumber, employeeNumber}= req.body;

        if (!password){
            return res.status(400).json({ message: "Email & password required" })
        };

        let user;

        if(studentNumber){
            user= await prisma.users.findUnique( {where: {studentNumber}})
        };

        if (!user && employeeNumber) {
            user = await prisma.users.findUnique({
                where: { employeeNumber }
            });
        }

        if (!user) return res.status(401).json({ message: "User not found" });

        const valid= await bcrypt.compare(password, user.password);
        if (!valid){
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = signAccessToken({ userId: user.id, role: user.role });
        const refreshToken = signRefreshToken({ userId: user.id, role: user.role });
      
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                studentNumber: user.studentNumber,
                employeeNumber: user.employeeNumber,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout= async (_req: Request, res: Response)=>{
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: "No refresh token" });
    
        const decoded = verifyRefreshToken(token) as any;
    
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(401).json({ message: "User not found" });
    
        const newAccessToken = signAccessToken({ userId: user.id, role: user.role });
        const newRefreshToken = signRefreshToken({ userId: user.id, role: user.role });
    
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};