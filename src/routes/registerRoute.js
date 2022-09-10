import express from "express";
import UserCreated from "../controllers/registerController.js"


const router = express.Router()

router.post("/createUser", UserCreated.createNewUser)
router.get("/getRegisteredUsers", UserCreated.getAllUsers)


export default router