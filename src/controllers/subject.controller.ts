import type { Request, Response } from "express";
import prisma from "../config/prisma.ts"

export const createSubject= async (req: Request, res: Response)=>{
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
            data: subject,
        });
    } catch (err) {
        console.error("Create Subject error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getSubjects= async(req: Request, res: Response)=>{
    try {
        const subjects= await prisma.subject.findMany({
            include: {
                classes:{
                    include: {
                        class: {
                            select: {
                                classUuid: true,
                                name: true
                            }
                        }
                    }
                },
                teachers: {
                    include: {
                        teacher: {
                            select: {
                                teacherUuid: true,
                                teacherName: true
                            }
                        }
                    }
                },
            }
        });

        const normalized= subjects.map(s => ({
            subjectUuid: s.subjectUuid,
            name: s.name,
            code: s.code,
            grade: s.grade,
            classes: s.classes.map(c => c.class),
            teachers: s.teachers.map(t => t.teacher),
        }))
        return res.status(200).json({data: normalized});
    } catch (err) {
        console.error("get Subjects error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getSubject= async(req: Request, res: Response)=>{
    try {
        const {subjectUuid}= req.params;
        const subject= await prisma.Subject.findUnique({
            where: {subjectUuid},
            include: {
                classes:{
                    include: {
                        class: {
                            select: {
                                classUuid: true,
                                name: true
                            }
                        }
                    }
                },
                teachers: {
                    include: {
                        teacher: {
                            select: {
                                teacherUuid: true,
                                teacherName: true,
                            }
                        }
                    }
                }
            }
        });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        };

        const normalized = {
            subjectUuid: subject.subjectUuid,
            name: subject.name,
            code: subject.code,
            grade: subject.grade,
            classes: subject.classes.map(c => c.class),
            teachers: subject.teachers.map(t => t.teacher),
        };
      
        return res.status(200).json({data: normalized});
    } catch (err) {
        console.error("Get Subject error:", err);
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

        const subjectExists = await prisma.Subject.findUnique({ where: { subjectUuid } });
        if (!subjectExists) {
            return res.status(404).json({ message: "Subject not found" });
        }

        const subject = await prisma.subject.update({
        where: { subjectUuid },
        data: { name, code, grade },
        });

        // await logAudit({
        //     userUuid: req.user.userUuid,
        //     action: "UPDATE",
        //     entity: "SUBJECT",
        //     entityId: subjectUuid,
        //     oldValue: oldSubject,
        //     newValue: updated,
        //   });

        return res.status(200).json({
            message: "Subject updated successfully",
            data: subject,
        });
    } catch (err) {
        console.error("Update Subject error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const deleteSubject= async(req: Request, res: Response)=>{
    try {
        const {subjectUuid}= req.params;
        if(!subjectUuid){
            return res.status(400).json({success: false, message: "Subject not found!"})
        };

        const subjectExists = await prisma.Subject.findUnique({ where: { subjectUuid } });
        if (!subjectExists) {
            return res.status(404).json({ message: "Subject not found" });
        }

        const [usedInClass, usedInTeacher, usedInExam] = await Promise.all([
            prisma.classSubject.findFirst({ where: { subjectUuid } }),
            prisma.teacherSubject.findFirst({ where: { subjectUuid } }),
            prisma.exam.findFirst({ where: { subjectUuid } }),
        ]);

        if (usedInClass || usedInTeacher || usedInExam) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete subject. It is in use.",
        });
        }

        await prisma.Subject.delete({ where: { subjectUuid }});
      
        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (err) {
        console.error("Delete Subject error:", err);
        return res.status(500).json({ message: err.message }); 
    }
};

// export const assignSubjectToClass = async (req: Request, res: Response) => {
//     try {
//       const { classUuid } = req.params;         
//       const { subjectUuid } = req.body;        
  
//       if (!classUuid || !subjectUuid) {
//         return res.status(400).json({ message: "classUuid and subjectUuid required" });
//       }
  
//       const [cls, subj] = await Promise.all([
//         prisma.class.findUnique({ where: { classUuid } }),
//         prisma.subject.findUnique({ where: { subjectUuid } })
//       ]);
  
//       if (!cls) return res.status(404).json({ message: "Class not found" });
//       if (!subj) return res.status(404).json({ message: "Subject not found" });
  
//       await prisma.classSubject.create({
//         data: { classUuid, subjectUuid }
//       });
  
//       return res.status(201).json({ message: "Subject assigned to class successfully" });
//     } catch (err: any) {
//       if (err.code === "P2002") {
//         return res.status(400).json({ message: "Subject already assigned to this class" });
//       }
//       console.error(err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
// };
  
export const assignSubjectToClass= async (req: Request, res: Response)=>{
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
        console.error("Assign Subject To Class error:", err);
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
  
      const classes = await prisma.class.findUnique({ where: { classUuid } });
      if(!classes) {
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
  
      return res.status(200).json({ message: "Class subjects updated", data: updated });
    } catch (err) {
      console.error("Update Class Subjects error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
};

export const removeSubjectFromClass= async(req: Request, res: Response)=>{
    try {
        const {classUuid, subjectUuid}= req.body;
        if(!subjectUuid || !classUuid!){
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
        console.error("Remove Subject From Class error:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const assignSubjectToTeacher = async (req: Request, res: Response) =>{
    try {
        const {subjectUuid}= req.params
        const { teacherUuid } = req.body;

        const subjectExists = await prisma.subject.findUnique({ where: { subjectUuid } });
        if (!subjectExists) {
            return res.status(404).json({ message: "Subject not found" });
        };

        const assigned= await prisma.teacherSubject.create({
            data: {
              teacherUuid,
              subjectUuid,
            },
        });

        return res.status(201).json({
            message: "Subject assigned to teacher successfully",
            data: assigned
        });
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(400).json({
              message: "Teacher already teaches this subject",
            });
        }
        console.error("Assign Subject To Teacher error:", err);
        return res.status(500).json({ message: err.message });
    };
};

export const assignSubjectsToTeacher = async (req: Request, res: Response) => {
    try {
      const { teacherUuid } = req.params;
      const { subjectUuids = [] } = req.body;
  
      if (!Array.isArray(subjectUuids) || subjectUuids.length === 0) {
        return res.status(400).json({ message: "subjectUuids required" });
      }
  
      const teacher = await prisma.teacher.findUnique({ where: { teacherUuid } });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const data = subjectUuids.map((subjectUuid: string) => ({
        teacherUuid,
        subjectUuid,
      }));
  
      const assigned= await prisma.teacherSubject.createMany({
        data,
        skipDuplicates: true,
      });
  
      return res.status(201).json({
        success: true,
        message: "Subjects assigned to teacher",
        data: assigned
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTeacherSubjects= async (req: Request, res: Response)=>{
    try {
        const {teacherUuid}= req.params
        const {subjectUuids = []}= req.body;

        if (!Array.isArray(subjectUuids) || subjectUuids.length === 0) {
            return res.status(400).json({ message: "subjectUuids required" });
        };

        const updated= await prisma.$transaction(async (tx) => {
            await tx.teacherSubject.deleteMany({
              where: { teacherUuid },
            });
      
            if (subjectUuids.length) {
              await tx.teacherSubject.createMany({
                data: subjectUuids.map((subjectUuid: string) => ({
                  teacherUuid,
                  subjectUuid,
                })),
                skipDuplicates: true,
              });
            }
        });

        return res.status(200).json({
            success: true,
            message: "Teacher subjects updated",
            data: updated
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const removeSubjectFromTeacher= async(req: Request, res: Response)=>{
    try {
        const { teacherUuid, subjectUuid } = req.body;

        const subjectExists = await prisma.subject.findUnique({ where: { subjectUuid } });
        if (!subjectExists) {
            return res.status(404).json({ message: "Subject not found" });
        }

        await prisma.teacherSubject.delete({
            where: {
              teacherUuid_subjectUuid: { teacherUuid, subjectUuid },
            },
        });
      
        return res.status(200).json({
        message: "Subject removed from teacher",
        });
    } catch (err:any) {
        console.error("Remove Subject From Teacher error:", err);
        return res.status(500).json({ message: err.message });
    }
};