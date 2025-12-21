import express from "express"
import { 
    assignChildParent, 
    deleteUser, 
    getUser, 
    getUsers, 
    updateProfile, 
    updateUser 
} from "../controllers/admin.controllers.ts";
import { createUser } from "../controllers/user.controller.ts";

const router= express.Router()

router.post("/create-user", createUser);

router.get("/:role", getUsers);
router.get("/:role/:uuid", getUser);
router.put("/:role/:uuid", updateUser);
router.delete("/:role/:uuid", deleteUser);

router.put("/update-profile/:userUuid", updateProfile);
router.post("/student/:studentUuid/assign-parent", assignChildParent);

export default router

