import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogByAuthor,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createBlog);

router.get("/", getBlogs);

router.get("/id/:blogId", verifyToken, getBlogById);

router.get("/author/:username", verifyToken, getBlogByAuthor);

router.put("/update/:blogId", verifyToken, updateBlog);

router.delete("/delete/:blogId", verifyToken, deleteBlog);

export default router;
