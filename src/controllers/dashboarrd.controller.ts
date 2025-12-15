import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"


export const getTotalStudents= async (req: Request, res: Response)=>{
    try {
        const totalStudents= await prisma.student.count();

        return res.status(200).json({success: true, totalStudents})
    } catch (err) {
        console.error("totalStudents error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTotalParents= async (req: Request, res: Response)=>{
    try {
        const totalParents= await prisma.student.count();

        return res.status(200).json({success: true, totalParents})
    } catch (err) {
        console.error("TotalParent error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTotalTeachers= async (req: Request, res: Response)=>{
    try {
        const totalParents= await prisma.student.count();

        return res.status(200).json({success: true, totalParents})
    } catch (err) {
        console.error("TotalTeachers error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAttendanceToday= async (req: Request, res: Response)=>{
    try {
        return res.status(200).json({
            success: true,
            presentStudents: 0,
            absentStudents: 0,
            note: "Attendance module not implemented yet",
        });
    } catch (err) {
        console.error("ttendanceToday error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFeesCollectedThisMonth= async (req: Request, res: Response)=>{
    try {
        return res.status(200).json({
            success: true,
            totalAmount: 0,
            currency: "USD",
            note: "Fees module not implemented yet",
        });
    } catch (err) {
        console.error("feesCollectedThisMonth error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUpcomingExams= async (req: Request, res: Response)=>{
    try {
        const today = new Date();

        const upcomingExams= await prisma.student.findMany({
            where: {
                examDate: {
                    gte: today
                }
            },
            orderBy: {
                examDate: "asc",
            },
            take: 5,
            include: {
                class: {
                    select: {name: true},
                },
                subject: {name: true}
            }
        });

        return res.status(200).json({success: true, upcomingExams})
    } catch (err) {
        console.error("upcomingExams error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDashboardOverview= async(req: Request, res: Response)=>{
    try {
        const today= new Date();
        today.setHours(0, 0, 0, 0);

        const [ 
            students,
            parents,
            teachers,
            attendanceToday,
            feesThisMonth,
            upcomingExams,
        ]= await Promise.all([
            prisma.student.count(),
            prisma.parent.count(),
            prisma.teacher.count(),

            prisma.attendance.groupBy({
                by: ["status"],
                where: { date: today },
                _count: true,
            }),

            prisma.payment.aggregate({
                where: {
                  paidAt: {
                    gte: new Date(today.getFullYear(), today.getMonth(), 1),
                  },
                },
                _sum: { amount: true },
            }),

            prisma.exam.findMany({
                where: { examDate: { gte: today } },
                orderBy: { examDate: "asc" },
                take: 5,
                include: {
                  class: { select: { name: true } },
                  subject: { select: { name: true } },
                },
            }),
        ]);

        res.status(200).json({
            success: true,
            stats: {
              students,
              parents,
              teachers,
              attendanceToday,
              feesThisMonth: feesThisMonth._sum.amount ?? 0,
              upcomingExams,
            },
        });
    } catch (err) {
        console.error("dashboard overview error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMonthlyAttendanceStats = async (_req: Request, res: Response) => {
    try {
        const stats= await prisma.attendance.groupBy({
            by: ["status"],
            _count: true,
        });

        res.status(200).json({
            success: true,
            stats,
        });
    } catch (err) {
        console.error("monthly Attendance Stats  error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMonthlyFeesStats = async (_req: Request, res: Response) => {
    try {
        const stats= await prisma.payment.groupBy({
            by: ["paidAt"],
            _sum: { amount: true },
        });

        res.status(200).json({
            success: true,
            stats,
        });      
    } catch (err) {
        console.error("monthly Fees Stats  error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};