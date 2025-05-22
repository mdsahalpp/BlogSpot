import express from "express";
import { createBlog, getBlogs } from "../controllers/blogController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createBlog);
router.get("/blogs", verifyToken, getBlogs);

export default router;
