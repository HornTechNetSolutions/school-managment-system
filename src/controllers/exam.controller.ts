import type { Request, Response, NextFunction } from "express";
import { start } from "repl";
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
            teacherUuid,
        }= req.body;

        if (!title || !examType || !examDate || !startTime || !endTime || !totalMarks || !classUuid || !subjectUuid || !teacherUuid) {
            return res.status(400).json({ message: "Missing required fields" });
        };

        const examDateTime = new Date(examDate);
        const startDateTime = new Date(`${examDate}T${startTime}`);
        const endDateTime = new Date(`${examDate}T${endTime}`);
    
        if (
          isNaN(examDateTime.getTime()) ||
          isNaN(startDateTime.getTime()) ||
          isNaN(endDateTime.getTime())
        ) {
          return res.status(400).json({
            message: "Invalid date or time format",
          });
        };

        if (startDateTime >= endDateTime) {
            return res.status(400).json({
              message: "Start time must be before end time",
            });
        };

        const [teacher, classInfo, subject] = await Promise.all([
            prisma.teacher.findUnique({ where: { teacherUuid } }),
            prisma.class.findUnique({ where: { classUuid } }),
            prisma.subject.findUnique({ where: { subjectUuid } }),
        ]);
      
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        if (!classInfo) return res.status(404).json({ message: "Class not found" });
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        const classSubject = await prisma.classSubject.findFirst({
            where: { classUuid, subjectUuid },
        });
        if (!classSubject) {
            return res.status(400).json({
              message: "Subject is not assigned to this class",
            });
        }

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
                examDate: examDateTime,
                startTime: startDateTime,
                endTime: endDateTime,
                totalMarks: Number(totalMarks),
                classUuid,
                subjectUuid,
                teacherUuid,
            }
        });

        return res.status(201).json({ message: "Exam created successfully", data: exam });
    } catch (err:any) {
        console.log("Error in create exam controller", err.message);
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
        console.log("Error in get exams controller", err.message);
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
        return res.json({ data: exam });
    } catch (err: any) {
        console.log("Error in get exam controller", err.message);
        return res.status(500).json({ message: err.message });
    }
};

export const updateExam= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;
        const {
            title,
            description,
            examDate,
            startTime,
            endTime,
            totalMarks,
        } = req.body;

        const exam= await prisma.exam.findUnique({where: {examUuid}})
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const hasResults= await prisma.examResult.findFirst({
            where: {examUuid}
        });
        if (hasResults) {
            return res.status(400).json({
              message: "Cannot update exam after grading has started",
            });
        }
       
        const data : any= {};

        if(title) data.title = title
        if(description) data.description= description

        if(examDate && startTime && endTime){
            const examDateTime = new Date(examDate);
            const startDateTime = new Date(`${examDate}T${startTime}`);
            const endDateTime = new Date(`${examDate}T${endTime}`);

            if(startDateTime >= endDateTime){
                return res.status(400).json({
                    message: "Start time must be before end time",
                });
            };

            data.examDate= examDateTime;
            data.startTime= startDateTime;
            data.endTime= endDateTime;
        };

        if(totalMarks !== undefined){
            if(totalMarks <= 0){
                return res.status(400).json({
                    message: "totalMarks must be greater than 0",
                });
            }
            data.totalMarks= Number(totalMarks)
        };
        
        const updatedExam = await prisma.exam.update({
            where: { examUuid },
            data,
        });

        return res.json({ message: "Exam updated", exam: updatedExam });
    } catch (err) {
        console.error("Update exam error:", err);
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
        console.error("Error in remove exam error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const assignResults= async (req: Request, res: Response)=>{
    try {
        const { examUuid } = req.params;
        const { studentUuid, marksObtained, comment } = req.body;

        if (!studentUuid || marksObtained === undefined) {
            return res.status(400).json({ message: "studentUuid and marksObtained are required" });
        };

        const teacherUserUuid = req.user.userId;

        const teacher = await prisma.teacher.findUnique({
            where: { userUuid: teacherUserUuid },
          });
        if (!teacher) {
            return res.status(403).json({ message: "Only teachers can grade exams" });
        };
      
        const exam = await prisma.exam.findUnique({ where: { examUuid } });
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        if (new Date() < exam.endTime) {
            return res.status(400).json({
              message: "Cannot grade exam before it finishes",
            });
        }

        const student = await prisma.student.findUnique({
            where: { studentUuid },
        });

        if (!student || student.classUuid !== exam.classUuid) {
            return res.status(400).json({
              message: "Student does not belong to this exam's class",
            });
        };

        if(marksObtained < 0 || marksObtained > exam.totalMarks){
            return res.status(400).json({message: `Marks must be between 0 and ${exam.totalMarks}`}) 
        };

        const existingResult= await prisma.examResult.findUnique({
            where: {examUuid_studentUuid: {examUuid, studentUuid}}
        });
        if(existingResult){
            return res.status(400).json({message: "Result is locked and cannot be updated",});
        };

        const result = await prisma.examResult.upsert({
            where: {
              examUuid_studentUuid: { examUuid, studentUuid }
            },
            update: {
              marksObtained,
              comment,
              gradedByUuid: teacher.teacherUuid,
              gradedAt: new Date(),
            //   status: "PUBLISHED",
            },
            create: {
              examUuid,
              studentUuid,
              marksObtained,
              comment,
              gradedByUuid: teacher.teacherUuid,
              gradedAt: new Date(),
            //   status: "PUBLISHED",
            },
        });
      
        
        return res.status(201).json({
            success: true,
            message: "Exam result recorded",
            data: result,
        });
    } catch (err: any) {
        console.error("Error in Assign exam result error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getExamResults= async (req: Request, res: Response)=>{
    try {
        const {examUuid}= req.params;

        const results = await prisma.examResult.findMany({
            where: { examUuid },
            orderBy: {student: {studentName: "asc"}},
            include: {
              student: {
                select: {
                    studentUuid: true,
                    studentName: true,
                    studentNumber: true
                }
              },
              gradedBy:{
                select: {
                    teacherUuid: true,
                    teacherName: true
                }
              }
            },
        });

        return res.status(200).json({ results });
    } catch (err: any) {
        console.error("Error in get exam results exam error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getExamResult= async (req: Request, res: Response)=>{
    try {
        const {resultUuid}= req.params

        const result= await prisma.examResult.findUnique({
            where: {resultUuid},
            include: {
                student:{
                    select: {
                        studentUuid: true,
                        studentName: true,
                        studentNumber: true
                    }
                },
                subject: {
                    select: {
                        subjectUuid: true,
                        subjectName: true
                    }
                },
                gradedBy:{
                    select: {
                        teacherUuid: true,
                        teacherName: true
                    }
                },
            }
        });

        res.status(201).json({success: false, message: {data: result}})
    } catch (err: any) {
        console.error("Error in get exam result error:", err);
        return res.status(500).json({ message: err.message });
    }
}

