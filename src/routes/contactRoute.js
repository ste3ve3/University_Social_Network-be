import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();


router.post("/sendMessage", contactController.sendMessage);

router.get("/getAllMessages", contactController.getAllMessages);

router.delete("/deleteMessage/:id", contactController.deleteMessage);

export default router;

