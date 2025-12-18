import prisma from "../config/prisma.ts";

export function validateBasicFields({
  fullName,
  email,
  password,
  confirmPassword,
  role,
}) {
  if (!fullName || !email || !password || !confirmPassword || !role) {
    return "All fields required";
  }

  if (password !== confirmPassword) return "Passwords do not match";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Invalid email";

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
    return "Weak password format";

  return null;
}

export async function validateRoleFields(role, body) {
  const {
    studentNumber,
    employeeNumber,
    adminNumber,
    employeeRole,
    teacherNumber,
  } = body;

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