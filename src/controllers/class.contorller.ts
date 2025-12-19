import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"

export const createClass= async (req: Request, res: Response)=>{
    try {
        const {name, grade, subjectUuids= [], teacherUuids= []}= req.body;
        if (!name || !grade) {
            return res.status(400).json({ message: "Name and grade are required" });
        };
        const newClass= await prisma.class.create({
            data: {
                name,
                grade: Number(grade),
                ClassSubject: subjectUuids.length
                    ? { create: subjectUuids.map((uuid: any) => ({ subjectUuid: uuid })) }
                    : undefined,
                teacher: teacherUuids.length
                    ? { connect: teacherUuids.map((uuid: any) => ({ teacherUuid: uuid })) }
                    : undefined
            }
        });

        return res.status(201).json({
            message: "Class created successfully",
            data: newClass,
        });
    } catch (err) {
        console.error("Create class error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getClasses= async (req: Request, res: Response)=>{
    try {
        const classes= await prisma.class.findMany({
            include: {
                students: true,
                teacher: true,
                ClassSubject: {
                    include: {
                        subject: true
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({ data: classes });
    } catch (err) {
        console.error("Get classes error:", err);
        res.status(500).json({ message: "Internal server error" });
    };
};

export const getClass= async (req: Request, res: Response)=>{
    try {
        const {classUuid}= req.params;
        const cls= await prisma.class.findUnique({
            where: {classUuid},
            include: {
                students: true,
                teacher: true,
                ClassSubject: {
                    include: { subject: true },
                },
            },
        });
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }
      
        return res.status(200).json({ data: cls });
    } catch (err) {
        console.error("Get class error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateClass= async (req: Request, res: Response)=>{
    try {
        const {classUuid}= req.params;
        const { name, grade, subjectUuids = [], teacherUuids = [] } = req.body;

        const updatedClass= await prisma.class.update({
            where: {classUuid},
            data: {
                name,
                grade: grade? Number(grade) : undefined,
                ClassSubject: {
                    deleteMany: {},
                    create: subjectUuids.length
                     ? { create: subjectUuids.map((uuid: any) => ({ subjectUuid: uuid })) }
                     : undefined, 
                },
                 //Connect class to teachers
                teacher: {
                    set: teacherUuids.length
                          ? { connect: teacherUuids.map((uuid: any) => ({ teacherUuid: uuid })) }
                           : undefined
                },
            },
            include: {
                students: true,
                teacher: true,
                ClassSubject: { include: { subject: true } },
            }
        });
        return res.status(200).json({
            message: "Class updated successfully",
            data: updatedClass,
        });
    } catch (err) {
        console.error("Update class error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteClass= async (req: Request, res: Response)=>{
    try {
        const {classUuid}= req.params;
        if(!classUuid){
            return res.status(401).json({success: false, message: "Class not found"})
        };
        await prisma.class.delete({
            where: { classUuid },
        });
        return res.status(200).json({ message: "Class deleted successfully" });
    } catch (err) {
        console.error("Delete class error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const assignStudentClass= async (req: Request, res: Response)=>{
    try {
        const {studentUuid}= req.params;
        const {classUuid}= req.body;
        if(!classUuid){
            return res.status(401).json({success: false, message: "ClassUuid required"})
        }; 
        
        const classExists= await prisma.class.findUnique({where: {classUuid}})
        if (!classExists) {
            return res.status(404).json({
              success: false,
              message: "Class not found",
            });
        }

        const student= await prisma.student.findUnique({where: {studentUuid}});
        if(!student){
            return res.status(400).json({ success: false, message: "Student not found" });
        };

        if (student.classUuid) {
            return res.status(400).json({
              success: false,
              message: "Student is already assigned to a class",
            });
        };
      
        await prisma.student.update({
        where: { studentUuid },
        data: {
            classUuid,
        },
        });
        
        return res.status(200).json({ message: "Student assigned to class successfully" });
    } catch (err) {
        console.error("Assign Student class error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};