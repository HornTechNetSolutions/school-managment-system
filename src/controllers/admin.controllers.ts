import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"

export const updateProfile= async(req: Request, res: Response)=>{
    try {
       const { userUuid }= req.params;
       const data= req.body;

       const user= await prisma.users.findUnique({where: {userUuid}});
       if (!user) {
        return res.status(404).json({ message: "User not found" });
       };
       
       const role= user.role;

       const allowedUserFields= [
         "fullName", "email", "status", "studentNumber","teacherNumber", "employeeNumber","adminNumber"
       ];
       const updateUserData: any= {};

       for(const key of allowedUserFields){
        if (data[key] !== undefined) updateUserData[key] = data[key];
       };

    //    let syncedName = null;
    //    if (data.fullName) syncedName = data.fullName;

        const roleFieldMap = {
            STUDENT: ["studentNumber", "classUuid", "parentUuid"],
            TEACHER: ["teacherNumber"],
            PARENT: [],
            EMPLOYEE: ["employeeNumber", "employeeRole", "department", "title"],
            ADMIN: ["adminNumber"],
        };

        const roleNameField = {
            STUDENT: "studentName",
            TEACHER: "teacherName",
            PARENT: "parentName",
            EMPLOYEE: "employeeName",
            ADMIN: "adminName",
        };
      
        const tableMap = {
            STUDENT: prisma.student,
            TEACHER: prisma.teacher,
            PARENT: prisma.parent,
            EMPLOYEE: prisma.employee,
            ADMIN: prisma.admin,
        };
  
        // const updatedUser= await prisma.users.update({
        //     where: {userUuid}, 
        //     data: updateUserData
        // });

        let roleUpdate = null;

        if(tableMap[role]){
            const updateData = {};
            if (data.fullName) {
                updateData[roleNameField[role]] = data.fullName;
            };

            for (const key of roleFieldMap[role]) {
                if (data[key] !== undefined) updateData[key] = data[key];
            };

            roleUpdate = await tableMap[role].update({
                where: { userUuid },
                data: updateData,
            });
        };
        const updatedUser = await prisma.users.update({
            where: { userUuid },
            data: updateUserData,
        });
      
        return res.json({
            message: "Profile updated successfully",
            user: updatedUser,
            roleInfo: roleUpdate,
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getModel = (role: string) => {
    switch (role) {
      case "student":
        return prisma.student;
      case "parent":
        return prisma.parent;
      case "employee":
        return prisma.employee;
      case "admin":
        return prisma.admin;
      default:
        return null;
    }
};

export const getUsers= async (req: Request, res: Response)=>{
    try {
        const {role}= req.params;

        const model= getModel(role);
        if(!model){
            return res.status(400).json({ message: "Invalid role" })
        };
        const users= await model.findMany();
        return res.status(200).json(users);
      
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUser= async (req: Request, res: Response)=>{
    try {
        const { role, uuid } = req.params;
        const model = getModel(role);
    
        if (!model) return res.status(400).json({ message: "Invalid role" });
    
        const user = await model.findUnique({ where: { userUuid: uuid } });
    
        if (!user) return res.status(404).json({ message: "User not found" });
    
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser= async (req: Request, res: Response)=>{
    try {
        const { role, uuid } = req.params;
        const data = req.body;
    
        const model = getModel(role);
    
        if (!model) return res.status(400).json({ message: "Invalid role" });
    
        const updated = await model.update({
          where: { userUuid: uuid },
          data,
        });
    
        return res.status(200).json(updated);
    } catch (err) {
        console.error(err);

        if (err.code === "P2025") {
          return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteUser= async (req: Request, res: Response)=>{
    try {
        const { role, uuid } = req.params;

        const model = getModel(role);
        if (!model) return res.status(400).json({ message: "Invalid role" });
    
        await model.delete({ where: { userUuid: uuid } });
    
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);

        if (err.code === "P2025") {
          return res.status(404).json({ message: "User not found" });
        }
    
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const assignChildParent= async (req: Request, res: Response)=>{
    try {
        const {studentUuid}= req.params
        const {parentUuid}= req.body;
        if(!parentUuid || !studentUuid){
            return res.status(400).json({ success: false, message: "parentUuid and studentUuid required" });
        };

        const parentAlreadyAssigned = await prisma.student.findFirst({
            where: { parentUuid }
        });

        if (parentAlreadyAssigned) {
            return res.status(400).json({
                success: false,
                message: "This parent is already assigned to another student"
            });
        }

        const parent= await prisma.parent.findUnique({where: {parentUuid}})
        if(!parent){
            return res.status(404).json({ success: false, message: "Parent not found" });
        };

        const student = await prisma.student.findUnique({
            where: { studentUuid }
        });
      
        if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
        };

        const updatedStudent= await prisma.student.update({
            where: {studentUuid},
            data: {
                parentUuid: parentUuid
            }
        });

        return res.status(200).json({
            success: true,
            message: "Parent linked to student successfully",
            student: updatedStudent
        });
    } catch (err) {
        console.error("Add child error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};