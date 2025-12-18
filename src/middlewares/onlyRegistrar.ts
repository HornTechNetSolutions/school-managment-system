import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.ts"


export const onlyRegistrar = async (req: Request, res: Response, next: NextFunction) => {
    const employee = await prisma.employee.findUnique({
      where: { userUuid: req.user.userId }
    });
  
    if (!employee || employee.employeeRole !== "REGISTRAR") {
      return res.status(403).json({
        message: "Only registrars can register students",
      });
    }
    next();
};
  