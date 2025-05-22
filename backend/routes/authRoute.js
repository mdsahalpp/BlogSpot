import express from "express";
import { signup, login, checkUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/checkAuth", verifyToken, checkUser);

export default router;
