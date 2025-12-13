import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"

export const createExam= async (req: Request, res: Response)=>{
    try {
        const {
            title,
            description,
            examType,
            examDate,
            startTime,
            endTime,
            totalMarks,
            classUuid,
            subjectUuid,
            teacherUuid
        }= req.body;

        if (!title || !examType || !examDate || !startTime || !endTime || !totalMarks || !classUuid || !subjectUuid || !teacherUuid) {
            return res.status(400).json({ message: "Missing required fields" });
        };

        const teacher= await prisma.teacher.findUnique({where: {teacherUuid}});
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const classInfo= await prisma.class.findUnique({where: {classUuid}});
        if (!classInfo) return res.status(404).json({ message: "Class not found" });

        const subject = await prisma.subject.findUnique({ where: { subjectUuid } });
        if (!subject) return res.status(404).json({ message: "Subject not found" });    

        const classSubject = await prisma.classSubject.findFirst({
            where: { classUuid, subjectUuid },
         });
      
        if (!classSubject) {
        return res.status(400).json({ message: "This subject is not assigned to this class" });
        };

        const teacherSubject= await prisma.teacherSubject.findFirst({
            where: { teacherUuid, subjectUuid },
        });
        if (!teacherSubject) {
            return res.status(400).json({ message: "Teacher is not assigned to this subject" });
        }

        const exam= await prisma.exam.create({
            data: {
                title,
                description,
                examType,
                examDate: new Date(examDate),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                totalMarks,
                classUuid,
                subjectUuid,
                teacherUuid,
            }
        });

        return res.status(201).json({ message: "Exam created successfully", exam });
    } catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
};

export const getExams= async (req: Request, res: Response)=>{
    try {
        const exams= await prisma.exam.findMany({
            include: {
                class: true,
                subject: true,
                teacher: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ exams });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const getExam= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;
        const exam = await prisma.exam.findUnique({
            where: { examUuid },
            include: {
              class: true,
              subject: true,
              teacher: true,
              results: {
                include: { student: true },
              },
            },
        });

        if (!exam) return res.status(404).json({ message: "Exam not found" });
        return res.json({ exam });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateExam= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;
        if(!examUuid){
            return res.status(400).json({success: false, message:"Exam not found"})
        };
        const data = req.body;
        
        const exam= await prisma.exam.findUnique({where: {examUuid}})
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const now= new Date();
        if(new Date(exam.examDate) < now){
            return res.status(400).json({ message: "Cannot update an exam that is already completed" });
        };

        const updatedExam = await prisma.exam.update({
            where: { examUuid },
            data,
        });

        return res.json({ message: "Exam updated", exam: updatedExam });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const removeExam= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;

        const exam = await prisma.exam.findUnique({
            where: { examUuid },
            include: { results: true },
        });
        if (!exam) return res.status(404).json({ message: "Exam not found" });
      
        if (exam.results.length > 0) {
        return res.status(400).json({ message: "Cannot delete exam that has results" });
        }
      
        await prisma.exam.delete({ where: { examUuid } });
      
        return res.json({ message: "Exam removed successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const assignResults= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;
        const { studentUuid, marksObtained, gradedByUuid, comment } = req.body;

        const exam = await prisma.exam.findUnique({ where: { examUuid } });
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const student = await prisma.student.findUnique({
            where: { studentUuid },
        });
      
        if (!student || student.classUuid !== exam.classUuid) {
        return res.status(400).json({ message: "Student does not belong to this class" });
        };

        const result = await prisma.examResult.upsert({
            where: {
              examUuid_studentUuid: { examUuid, studentUuid }
            },
            update: {
              marksObtained,
              gradedByUuid,
              gradedAt: new Date(),
              comment,
            },
            create: {
              examUuid,
              studentUuid,
              marksObtained,
              gradedByUuid,
              gradedAt: new Date(),
              comment,
            },
        });
      
        return res.json({ message: "Result recorded", result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const getExamResults= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;

        const results = await prisma.examResult.findMany({
            where: { examUuid },
            include: {
              student: true,
              gradedBy: true,
            },
        });

        return res.json({ results });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

