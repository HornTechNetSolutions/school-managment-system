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
        const {subjectUuid}= req.params;
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

export const assignSubjectToClass = async (req: Request, res: Response) => {
    try {
      const { classUuid } = req.params;         
      const { subjectUuid } = req.body;        
  
      if (!classUuid || !subjectUuid) {
        return res.status(400).json({ message: "classUuid and subjectUuid required" });
      }
  
      const [cls, subj] = await Promise.all([
        prisma.class.findUnique({ where: { classUuid } }),
        prisma.subject.findUnique({ where: { subjectUuid } })
      ]);
  
      if (!cls) return res.status(404).json({ message: "Class not found" });
      if (!subj) return res.status(404).json({ message: "Subject not found" });
  
      await prisma.classSubject.create({
        data: { classUuid, subjectUuid }
      });
  
      return res.status(201).json({ message: "Subject assigned to class successfully" });
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.status(400).json({ message: "Subject already assigned to this class" });
      }
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};
  

export const addSubjectsToClass= async (req: Request, res: Response)=>{
    try {
        const {classUuid}= req.params;
        const { subjectUuids = [] } = req.body;

        if (!classUuid) {
            return res.status(400).json({ message: "classUuid required" });
        };

        if (!Array.isArray(subjectUuids) || subjectUuids.length === 0) {
            return res.status(400).json({ message: "subjectUuids must be a non-empty array" });
        };

        const cls = await prisma.class.findUnique({ where: { classUuid } });
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }

        const found = await prisma.subject.findMany({
            where: { subjectUuid: { in: subjectUuids } },
            select: { subjectUuid: true }
        });

        const foundUuids = new Set(found.map(s => s.subjectUuid));

        const missing = subjectUuids.filter((u: string) => !foundUuids.has(u));
        if (missing.length) {
            return res.status(404).json({ message: "Some subjects not found", missing });
        }
      
        const data = subjectUuids.map((subjectUuid: string) => ({ classUuid, subjectUuid }));
        await prisma.classSubject.createMany({ data, skipDuplicates: true });

        return res.status(201).json({ message: "Subjects assigned (existing assignments skipped)" });    
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(400).json({
                message: "Subject is already assigned to this class",
            });
        }
        return res.status(500).json({ message: err.message });
    }
};

export const updateClassSubjects = async (req: Request, res: Response) => {
    try {
      const { classUuid } = req.params;
      const { subjectUuids = [] } = req.body;
  
      if (!classUuid) {
        return res.status(400).json({ message: "classUuid required" });
      }
  
      const class = await prisma.class.findUnique({ where: { classUuid } });
      if (!class) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      if (subjectUuids.length) {
        const found = await prisma.subject.findMany({ where: { subjectUuid: { in: subjectUuids } }, select: { subjectUuid: true } });
        const foundSet = new Set(found.map(s => s.subjectUuid));
        const missing = subjectUuids.filter((u: string) => !foundSet.has(u));
        if (missing.length) return res.status(404).json({ message: "Some subjects not found", missing });
      }
  
      // transaction: remove those not in new list, add new ones
      await prisma.$transaction(async (tx) => {
        // delete rows for this class that are not in new list
        if (subjectUuids.length) {
          await tx.classSubject.deleteMany({
            where: {
              classUuid,
              subjectUuid: { notIn: subjectUuids }
            }
          });
        } else {
          // clearing all subjects for the class
          await tx.classSubject.deleteMany({ where: { classUuid } });
        }
  
        // add missing assignments; createMany skipDuplicates true is useful
        if (subjectUuids.length) {
          const toCreate = subjectUuids.map((subjectUuid: string) => ({ classUuid, subjectUuid }));
          await tx.classSubject.createMany({ data: toCreate, skipDuplicates: true });
        }
      });
  
      const updated = await prisma.class.findUnique({
        where: { classUuid },
        include: { ClassSubject: { include: { subject: true } } }
      });
  
      return res.status(200).json({ message: "Class subjects updated", class: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
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