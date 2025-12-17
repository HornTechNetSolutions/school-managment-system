import pkg from 'express';
const { Request, Response } = pkg;

import prisma from '../../config/prisma.ts';


export const getTeacherDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { teacherUuid: id },
            include: { 
                user: { select: { email: true, fullName: true, status: true } },
                
                TeacherSubject: {
                    select: {
                        subject: { select: { name: true, code: true } }
                    }
                }
            },
        });
        
        if (!teacher) {
            return res.status(404).json({ status: 'fail', message: 'Teacher not found.' });
        }
        
        
        const subjects = teacher.TeacherSubject.map(ts => ts.subject);
        
        const responseData = {
            ...teacher,
            subjectsTaught: subjects,
            TeacherSubject: undefined 
        };

        res.status(200).json({ status: 'success', data: { teacher: responseData } });
    } catch (error) {
        console.error('Error fetching teacher details:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve teacher details.' });
    }
};

// search  teacher's classes

export const getTeacherClasses = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const teacherWithClasses = await prisma.teacher.findUnique({
            where: { teacherUuid: id },
            include: {
                classes: {
                    select: {
                        classUuid: true,
                        name: true,
                        grade: true,
                        ClassSubject: {
                            select: { subject: { select: { name: true } } }
                        }
                    }
                }
            }
        });

        if (!teacherWithClasses) {
            return res.status(404).json({ status: 'fail', message: 'Teacher not found.' });
        }
        
        const classes = teacherWithClasses.classes.map(cls => ({
            classUuid: cls.classUuid,
            name: cls.name,
            grade: cls.grade,
            subjects: cls.ClassSubject.map(cs => cs.subject.name)
        }));

        res.status(200).json({ 
            status: 'success', 
            results: classes.length,
            data: { classes } 
        });
    } catch (error) {
        console.error('Error fetching teacher classes:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve teacher classes.' });
    }
};