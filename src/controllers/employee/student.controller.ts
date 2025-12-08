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