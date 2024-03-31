import express from "express";
import { checkuser, login, register } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
// router.get("/check", checkuser);
router.get("/check", authMiddleware, checkuser);

export default router;
