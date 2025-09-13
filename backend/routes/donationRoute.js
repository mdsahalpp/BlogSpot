import express from "express";
import { createOrder, verifyOrder } from "../controllers/donationHandler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post("/verify-order", verifyToken, verifyOrder);

export default router;
