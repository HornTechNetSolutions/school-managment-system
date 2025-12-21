import express from "express"
import { 
    createClass, 
    deleteClass, 
    getClass, 
    getClasses, 
    updateClass,
    assignStudentClass
} from "../controllers/class.contorller.ts";


const router= express.Router()

router.post("/create", createClass);
router.get("/", getClasses);
router.get("/:classUuid", getClass);
router.put("/:classUuid", updateClass);
router.delete("/:classUuid", deleteClass);

router.post("/student/:studentUuid/assign", assignStudentClass); // not tested


export default router
