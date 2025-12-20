import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.ts"

export const parentWithChildren= async ()=>{
    // const parentWithChildren = await prisma.parent.findUnique({
    //     where: { parentUuid },
    //     include: { children: true }
    //   });
};

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { email, password, studentNumber, fullName, confirmPassword} = body;
    console.log("REGISTER STUDENT BODY:", req.body);
    if (!email || !password || !confirmPassword || !studentNumber || !fullName) {
      return res.status(400).json({ message: "All fields required" });
    };

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    };

    const employee = await prisma.employee.findUnique({
      where: { userUuid: req.user.userId },
    });

    if (!employee || employee.employeeRole !== "REGISTRAR") {
      return res.status(403).json({ message: "Only registrars can register students" });
    };

    if (await prisma.users.findUnique({ where: { email } })) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (await prisma.student.findUnique({ where: { studentNumber } })) {
      return res.status(400).json({ message: "Student number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });
    
    const student = await prisma.student.create({
      data: {
        studentName: fullName,
        studentEmail: email,
        studentNumber,
        userUuid: user.userUuid,
        registeredByUuid: employee.employeeUuid,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student,
    });
  } catch (err) {
    console.error("Register student error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllStudents = async (_req: Request, res: Response) => {
    try {
      const students = await prisma.student.findMany({
        include: {
          parent: true,
          class: true,
          registeredBy: {
            select: {
              employeeName: true,
            },
          },
        },
      });
  
      res.status(200).json({
        success: true,
        students,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
};
  