
import pkg from 'express';
import prisma from '../../config/prisma.ts';

const { Request, Response } = pkg;

export const getParentDetails = async (req: Request, res: Response) => {
	
    const { id } = req.params;
    try {
        const parent = await prisma.parent.findUnique({
            where: { parentUuid: id },
            include: { 
                user: { select: { email: true, fullName: true, status: true } } 
            },
        });
        if (!parent) {
            return res.status(404).json({ status: 'fail', message: 'Parent not found.' });
        }
        res.status(200).json({ status: 'success', data: { parent } });
    } catch (error) {
        console.error('Error fetching parent details:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve parent details.' });
    }
};


// Parent's students list
export const getStudentsList = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const children = await prisma.student.findMany({
            where: { parentUuid: id },
            select: {
                studentUuid: true,
                studentName: true,
                studentNumber: true,
                class: { select: { name: true, grade: true } }
            }
        });

        if (children.length === 0) {
             return res.status(404).json({ status: 'fail', message: 'Parent found, but no children linked.' });
        }

        res.status(200).json({ 
            status: 'success', 
            results: children.length,
            data: { children } 
        });
    } catch (error) {
        console.error('Error fetching children list:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve children list.' });
    }
};

// update parent information
export const updateParentContact = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body; 

    if (!email) {
        return res.status(400).json({ status: 'fail', message: 'Email field is required for update.' });
    }

    try {
        // 1. Find the parent and get the linked userUuid
        const parentToUpdate = await prisma.parent.findUnique({ 
            where: { parentUuid: id },
            select: { userUuid: true }
        });

        if (!parentToUpdate) {
            return res.status(404).json({ status: 'fail', message: 'Parent not found.' });
        }

        // 2. Linked fields update 
        await prisma.$transaction([
            prisma.parent.update({
                where: { parentUuid: id },
                data: { parentEmail: email } 
            }),
            prisma.users.update({
                where: { userUuid: parentToUpdate.userUuid },
                data: { email: email } 
            }),
        ]);

        res.status(200).json({ 
            status: 'success', 
            message: 'Parent contact information successfully updated.' 
        });

    } catch (error) {
    
        if (error.code === 'P2002') {
             return res.status(409).json({ status: 'fail', message: 'Email address is already in use.' });
        }
        console.error('Error updating parent contact:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update parent contact info.' });
    }
};