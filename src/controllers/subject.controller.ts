import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"

export const addSubject= async (req: Request, res: Response)=>{
    try {
        const {name, code, grade}= req.body;
        if (!name) {
            return res.status(400).json({ message: "Subject name is required" });
        };
        const subject= await prisma.subject.create({
            data:{name, code, grade}
        });
        return res.status(201).json({
            message: "Subject created successfully",
            subject,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getSubjects= async(req: Request, res: Response)=>{
    try {
        const subjects= await prisma.subject.findMany({
            include: {
                classes: true,
                teachers: true
            }
        });
        return res.status(200).json(subjects);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getSubject= async(req: Request, res: Response)=>{
    try {
        const {subjectUuid}= req.params
        const subject= await prisma.subject.findUnique({
            where: {subjectUuid},
            include: {
                classes: true,
                teachers: true
            }
        });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        };
      
        return res.status(200).json(subject);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateSubject= async(req: Request, res: Response)=>{
    try {
        const { subjectUuid } = req.params;
        const { name, code, grade } = req.body;

        if(!subjectUuid){
            return res.status(400).json({success: false, message: "Subject not found!"})
        }

        const subject = await prisma.subject.update({
        where: { subjectUuid },
        data: { name, code, grade },
        });

        return res.status(200).json({
        message: "Subject updated successfully",
        subject,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deleteSubject= async(req: Request, res: Response)=>{
    try {
        const {subjectUuid}= req.params;
        if(!subjectUuid){
            return res.status(400).json({success: false, message: "Subject not found!"})
        };

        await prisma.subject.delete({
            where: { subjectUuid },
        });
      
        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message }); 
    }
};

export const assignSubjectToClass= async (req: Request, res: Response)=>{
    try {
        const {classUuid, subjectUuid}= req.body;
        await prisma.classSubject.create({
            data: {
                classUuid,
                subjectUuid,
            },
        });

        return res.status(201).json({
        message: "Subject assigned to class successfully",
        });
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(400).json({
                message: "Subject is already assigned to this class",
            });
        }
        return res.status(500).json({ message: err.message });
    }
};

export const removeSubjectFromClass= async(req: Request, res: Response)=>{
    try {
        const {classUuid, subjectUuid}= req.body;
        if(!subjectUuid || classUuid!){
            return res.status(401).json({success: false, message: "Class or Subject not found"})
        };
        await prisma.classSubject.delete({
            where: {
                classUuid_subjectUuid: { classUuid, subjectUuid },
            },
        });

        return res.status(200).json({
            message: "Subject removed from class",
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const assignSubjectToTeacher = async (req: Request, res: Response) =>{
    try {
        const { teacherUuid, subjectUuid } = req.body;

        await prisma.teacherSubject.create({
            data: {
              teacherUuid,
              subjectUuid,
            },
        });
      
        return res.status(201).json({
        message: "Subject assigned to teacher successfully",
        });
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(400).json({
              message: "Teacher already teaches this subject",
            });
        }
        return res.status(500).json({ message: err.message });
    };
};

export const removeSubjectFromTeacher= async(req: Request, res: Response)=>{
    try {
        const { teacherUuid, subjectUuid } = req.body;
        await prisma.teacherSubject.delete({
            where: {
              teacherUuid_subjectUuid: { teacherUuid, subjectUuid },
            },
        });
      
        return res.status(200).json({
        message: "Subject removed from teacher",
        });
    } catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
};