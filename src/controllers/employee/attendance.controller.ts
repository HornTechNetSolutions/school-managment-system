import pkg from 'express';
const { Request, Response } = pkg;
import prisma from '../../config/prisma.ts';

export const markAttendance = async (req: Request, res: Response) => {
    // not yet configured
};

export const getClassAttendance = async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { date } = req.query;

    const queryDate = date ? new Date(date as string) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    try {
        const attendanceList = await prisma.attendance.findMany({
            where: { classUuid: classId, date: queryDate },
            include: { student: { select: { studentName: true, studentNumber: true } } }
        });

        res.status(200).json({ status: 'success', results: attendanceList.length, data: { attendance: attendanceList } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch class attendance.' });
    }
};

export const getStudentAttendance = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        const history = await prisma.attendance.findMany({
            where: { studentUuid: studentId },
            orderBy: { date: 'desc' },
            include: { class: { select: { name: true } } }
        });

        res.status(200).json({ status: 'success', results: history.length, data: { history } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch student history.' });
    }
};