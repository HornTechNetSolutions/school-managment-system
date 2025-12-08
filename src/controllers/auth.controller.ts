import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.ts"
import { signAccessToken, signRefreshToken,verifyRefreshToken } from  "../utils/jwt.ts"

function validateBasicFields({ fullName, email, password, confirmPassword, role }) {
  if (!fullName || !email || !password || !confirmPassword || !role) {
    return "All fields required";
  }
  if (password !== confirmPassword) return "Passwords do not match";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email";
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
    return "Weak password format";
  return null;
};

async function validateRoleFields(role, body) {
  const { studentNumber, employeeNumber, adminNumber, employeeRole, teacherNumber } = body;

  switch (role.toUpperCase()) {
    case "STUDENT":
      if (!studentNumber) return "Student number required";
      if (await prisma.student.findUnique({ where: { studentNumber } }))
        return "Student number already used";
      break;

    case "EMPLOYEE":
      if (!employeeNumber) return "Employee number required";
      if (!employeeRole) return "Employee role required";
      if (await prisma.employee.findUnique({ where: { employeeNumber } }))
        return "Employee number already used";
      break;

    case "ADMIN":
      if (!adminNumber) return "Admin number required";
      if (await prisma.admin.findUnique({ where: { adminNumber } }))
        return "Admin number already used";
      break;
    case "TEACHER":
      if (!teacherNumber) return "Teacher number required";
      if (await prisma.teacher.findUnique({ where: { teacherNumber } }))
        return "Teacher number already used";
      break;

    case "PARENT":
      break;

    default:
      return "Invalid role";
  }

  return null;
};

async function createProfile(role, user, body) {
  const { fullName, employeeRole, department, title, studentNumber,  employeeNumber, 
    teacherNumber, adminNumber} = body;

  switch (role.toUpperCase()) {
    case "STUDENT":
      return prisma.student.create({
        data: {
          studentUuid: user.userUuid,
          studentName: fullName,
          studentEmail: user.email,
          studentNumber,
          userUuid: user.userUuid,
        },
      });

    case "EMPLOYEE":
      return prisma.employee.create({
        data: {
          employeeUuid: user.userUuid,
          employeeName: fullName,
          employeeEmail: user.email,
          employeeNumber,
          userUuid: user.userUuid,
          employeeRole,
          department: department || null,
          title: title || null,
        },
      });

    case "PARENT":
      return prisma.parent.create({
        data: {
          parentUuid: user.userUuid,
          parentName: fullName,
          parentEmail: user.email,
          userUuid: user.userUuid,
        },
      });

    case "TEACHER":
      return prisma.teacher.create({
        data: {
          teacherUuid: user.userUuid,
          teacherName: fullName,
          teacherNumber,
          teacherEmail: user.email,
          userUuid: user.userUuid,
        },
      });

    case "ADMIN":
      return prisma.admin.create({
        data: {
          adminUuid: user.userUuid,
          adminName: fullName,
          adminNumber,
          adminEmail: user.email,
          userUuid: user.userUuid,
        },
      });
  }
};

export const createUser= async (req: Request, res: Response)=>{
  try {
    const body = req.body;
    const { role, email, password } = body;

    const baseError = validateBasicFields(body);
    if (baseError) return res.status(400).json({ success: false, message: baseError });

    const roleError = await validateRoleFields(role, body);
    if (roleError) return res.status(400).json({ success: false, message: roleError });

    if (await prisma.users.findUnique({ where: { email } }))
      return res.status(400).json({ success: false, message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      },
    });

    const profile = await createProfile(role, user, body);

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      profile,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  };

  // await prisma.refreshToken.create({
  //     data: {
  //       token: refreshToken,
  //       userId: newUser.id,
  //     },
  // });
};

export const login= async (req: Request, res: Response)=>{
  try {
    const {password, studentNumber, employeeNumber, email, adminNumber}= req.body;

    if (!password){
        return res.status(400).json({ message: "Email & password required" })
    };

    let user= null

    if (!user && email) {
      user = await prisma.users.findUnique({ where: { email } });
    };

    if(studentNumber){
        const student = await prisma.student.findUnique({
          where: {studentNumber},
          include: { user: true },
        });
        if (student) user = student.user;
    };

    if (!user && employeeNumber) {
      const employee = await prisma.employee.findUnique({
        where: { employeeNumber },
        include: { user: true },
      });

      if (employee) user = employee.user;
    };

    if(!user && adminNumber){
      const admin= await prisma.admin.findUnique({
        where: { adminNumber },
        include: { user: true },
      });
      if(admin) user= admin.user;
    };

    if (employeeNumber) {
        user = await prisma.employee.findUnique({
            where: { employeeNumber }
        });
    };

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const valid= await bcrypt.compare(password, user.password);
    if (!valid){
        return res.status(401).json({ message: "Invalid credentials" });
    };

    const accessToken = signAccessToken({ userId: user.userUuid, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.userUuid, role: user.role });
    console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
    console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          studentNumber,
          employeeNumber,
          adminNumber
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout= async (req: Request, res: Response)=>{
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ success: true, message: "Logged out successfully" });
} catch (err) {
    console.log("Error in logout controller", err.message);
    res.status(500).json({ success: false, message: "Internal server error" }); 
}
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: "No refresh token" });
    
        const decoded = verifyRefreshToken(token) as any;
    
        const user = await prisma.users.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(401).json({ message: "User not found" });
    
        const newAccessToken = signAccessToken({ userId: user.id, role: user.role });
        const newRefreshToken = signRefreshToken({ userId: user.id, role: user.role });
    
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

export const getMe= async (req: Request, res: Response)=>{
  try {
    const userData= (req as any).user;
    console.log("req.user:", userData);

    if (!userData) {
      return res.status(401).json({ message: "Not authenticated" });
    };

    const user = await prisma.users.findUnique({
      where: { userUuid: userData.userId },
      include: {
        student: true,
        teacher: true,
        parent: true,
        employee: true,
        admin: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentNumber: user.studentNumber,
        employeeNumber: user.employeeNumber,
        parentNumber: user.parentNumber,

        student: user.student,
        teacher: user.teacher,
        parent: user.parent,
        employee: user.employee,
        admin: user.admin,
      },
    });
  } catch (err: any) {
    console.error("getMe error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const changePassword= async (req: Request, res: Response)=>{
  try {
    
  } catch (err) {
    
  }
}