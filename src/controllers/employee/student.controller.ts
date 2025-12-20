import pkg from 'express';
import prisma from '../../config/prisma.ts';

const { Request, Response, Router } = pkg;

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            select: {
                studentUuid: true,
                studentName: true,
                studentNumber: true,
                class: { select: { name: true } },
                user: { select: { email: true, status: true } },
            },
        });
        res.status(200).json({ status: 'success', data: { students } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve students.' });
    }
};


// search Student by ID
export const getStudentDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { studentUuid: id },
            include: {
                user: { select: { fullName: true, email: true, status: true } },
                parent: true,
                class: { select: { name: true, grade: true } },
            },
        });
        if (!student) {
            return res.status(404).json({ status: 'fai', message: 'Student not found.' });
        }
        res.status(200).json({ status: 'success', data: { student } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to find student details.' });
    }
};


export const updateStudentContact = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, address, phone } = req.body; 

    try {
        const studentToUpdate = await prisma.student.findUnique({ 
            where: { studentUuid: id },
            select: { userUuid: true } 
        });

        if (!studentToUpdate) {
            return res.status(404).json({ status: 'fail', message: 'Student not found.' });
        }

        const [updatedStudent, updatedUser] = await prisma.$transaction([
            
            prisma.student.update({
                where: { studentUuid: id },
                data: { studentEmail: email } 
            }),

            prisma.users.update({
                where: { userUuid: studentToUpdate.userUuid },
                data: { email: email } 
            }),
        ]);

        res.status(200).json({ status: 'success', message: 'Student contact information updated.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update contact info.' });
    }
};


export const getStudentAttendance = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const attendance = await prisma.attendance.findMany({
            where: { studentUuid: id },
            orderBy: { date: 'desc' },
            include: {
                class: { select: { name: true, grade: true } }
            }
        });

        if (!attendance) {
            return res.status(404).json({ status: 'fail', message: 'No attendance records found for this student.' });
        }

        res.status(200).json({
            status: 'success',
            results: attendance.length,
            data: { attendance }
        });
    } catch (error) {
        console.error('Error fetching student attendance:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};


export const getStudentGrades = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const grades = await prisma.examResult.findMany({
            where: { studentUuid: id },
            include: {
                exam: {
                    select: {
                        title: true,
                        examType: true,
                        totalMarks: true,
                        subject: { select: { name: true } }
                    }
                }
            },
            orderBy: { exam: { examDate: 'desc' } }
        });

        
        const average = grades.length > 0 
            ? grades.reduce((acc, curr) => acc + (curr.marksObtained || 0), 0) / grades.length 
            : 0;

        res.status(200).json({
            status: 'success',
            results: grades.length,
            data: { 
                statistics: { averageMarks: average.toFixed(2) },
                grades 
            }
        });
    } catch (error) {
        console.error('Error fetching student grades:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};