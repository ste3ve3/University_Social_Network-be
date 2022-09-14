import express from "express"
import loginController from "../controllers/loginController.js"
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './src/images');
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});


const router = express.Router()

router.post("/loginUser", loginController.loginUser)

router.get("/loggedInUser", loginController.loggedInUser)

router.post("/forgotPassword", loginController.forgotPassword)

router.get("/resetPassword", loginController.resetPassword)

router.put("/newPassword", loginController.newPassword)

router.put("/updateUser", upload.single('image'), loginController.updateUser)



export default router