import express from "express"
import loginController from "../controllers/loginController.js"


const router = express.Router()

router.post("/loginUser", loginController.loginUser)

router.get("/loggedInUser", loginController.loggedInUser)

router.post("/updateUser", loginController.updateUser)



export default router