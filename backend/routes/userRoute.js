import express from "express";
const router = express.Router();

import { updateUsername } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

router.put("/username", verifyToken, updateUsername);

export default router;
