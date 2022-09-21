import express from "express";
import UserCreated from "../controllers/registerController.js"
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './src/transcriptImages');
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

router.post("/createUser", UserCreated.createNewUser)
router.get("/getRegisteredUsers", UserCreated.getAllUsers)
router.get("/verifyEmail", UserCreated.verifyEmail)
router.put("/updateUser1", UserCreated.updateUser1)
router.put("/updateUser3", UserCreated.updateUser3)
router.put("/updateUser2", upload.single('transcript'), UserCreated.updateUser2)


export default router