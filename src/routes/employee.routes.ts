import express from "express"
import { registerStudent } from "../controllers/employee.controller.ts";
import { assignSubjectToClass } from "../controllers/subject.controller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";
import { onlyRegistrar } from "../middlewares/onlyRegistrar.ts";
const router= express.Router()


router.post("/register-student", authenticate, authorize("EMPLOYEE"), onlyRegistrar, registerStudent);
router.post("/subject/assign-class/:classUuid", authenticate, authorize('ADMIN', "REGISTRAR"), assignSubjectToClass)


export default router;