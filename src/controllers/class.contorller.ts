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
                //class-subject relation
                classSubject: {
                    create: subjectUuids.map((uuid: string)=> ({
                        subjectUuid: uuid
                    })),
                },
                //Connect class to teachers
                teacher:{
                    connect: teacherUuids.map((uuid: string)=> ({teacherUuid: uuid}))
                }
            }
        });

        return res.status(201).json({
            message: "Class created successfully",
            class: newClass,
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
                classSubject: {
                    include: {
                        subject: true
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({ classes });
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
      
        return res.status(200).json({ class: cls });
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
                classSubject: {
                    deleteMany: {},
                    create: subjectUuids.map((uuid: string)=> ({
                        subjectUuid: uuid,
                    }))
                },
                teacher: {
                    set: teacherUuids.map((uuid: string) => ({teacherUuid: uuid}))
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
            class: updatedClass,
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
        if(!studentUuid){
            return res.status(401).json({success: false, message: "StudentUuid required"})
        }; 
        
        const studentAlreadyAssigned= await prisma.student.findFirst({where: {studentUuid}});
        if(!studentAlreadyAssigned){
            return res.status(400).json({
                success: false,
                message: "This parent is already assigned to another student"
            });
        };
        
    } catch (err) {
        
    }
};

