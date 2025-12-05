import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"

export const addChild= async (req: Request, res: Response)=>{
    try {
        const {parentUuid, studentUuid}= req.body;
        if(!parentUuid || !studentUuid){
            return res.status(400).json({ success: false, message: "parentUuid and studentUuid required" });
        };

        const parent= await prisma.parent.findUnique({where: {parentUuid}})
        if(!parent){
            return res.status(404).json({ success: false, message: "Parent not found" });
        };

        const student = await prisma.student.findUnique({
            where: { studentUuid }
        });
      
        if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
        };

        const updatedStudent= await prisma.student.update({
            where: {studentUuid},
            data: {
                parentUuid: parentUuid
            }
        });

        return res.status(200).json({
            success: true,
            message: "Parent linked to student successfully",
            student: updatedStudent
        });
    } catch (err) {
        console.error("Add child error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};

