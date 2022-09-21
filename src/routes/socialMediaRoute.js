import express from "express"
import socialMediaDecodedController from "../controllers/socialMediaDecodedController.js"


const router = express.Router()


router.get("/socialMediaLoggedInUser", socialMediaDecodedController.socialMediaLoggedInUser)

router.get("/socialMediaLogoutUser", socialMediaDecodedController.socialMediaLogoutUser)

router.put("/socialMediaUpdateUser", socialMediaDecodedController.socialMediaUpdateUser)

export default router