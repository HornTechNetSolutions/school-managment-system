import prisma from "../config/prisma.ts";

interface user {
    role: String,
    user: String,
    body: String,
    registeredByUuid: String
}

export async function createProfile(role, user, body, registeredByUuid?) {
  const {
    fullName,
    employeeRole,
    department,
    title,
    studentNumber,
    employeeNumber,
    teacherNumber,
    adminNumber,
  } = body;

  switch (role.toUpperCase()) {
    case "STUDENT":
      return prisma.student.create({
        data: {
          studentName: fullName,
          studentEmail: user.email,
          studentNumber,
          userUuid: user.userUuid,
          registeredByUuid, // 🔥 IMPORTANT
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