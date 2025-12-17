import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"

export const parentWithChildren= async ()=>{
    // const parentWithChildren = await prisma.parent.findUnique({
    //     where: { parentUuid },
    //     include: { children: true }
    //   });
}

export const registerStudent= async (req: Request, res: Response)=>{
    try {
       const {
            fullName,
            birthDate,
            birthPlace,
            address,
            studentNumber,
            parentUuid,
            classUuid,
        }= req.body;

        const registrarUuid = req.user?.employeeUuid;
        if (!registrarUuid) {
            return res.status(403).json({
              success: false,
              message: "Only registrars can register students",
            });
        };

       if(!fullName || !birthDate || !birthPlace || !address || !studentNumber){
        return res.status(400).json({success: false, message: "All required fields must be provided"})
       };

       const student= await prisma.create({
        data: {
            studentName: fullName,
            studentNumber,
            registeredByUuid: registrarUuid,
            parentUuid: parentUuid || undefined,
            classUuid: classUuid || undefined,
        },
        include: {
            parent: true,
            class: true,
            registeredBy: {
                select: {
                    employeeName: true,
                    employeeRole: true,
                },
            },
        }
       });

       return res.status(201).json({
        success: true,
        message: "Student registered successfully",
        student,
      });
    } catch (err) {
        console.error("Update profile error:", err);
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
  