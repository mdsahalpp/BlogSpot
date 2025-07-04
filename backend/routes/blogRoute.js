import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogByAuthor,
  updateBlog,
  deleteBlog,
  searchBlogs,
} from "../controllers/blogController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import multer from "multer";
import { imgStorage } from "../utils/cloudinary.js";

const upload = multer({ storage: imgStorage });

const router = express.Router();

router.post("/create", verifyToken, upload.single("image"), createBlog);

router.get("/", getBlogs);

router.get("/:blogId", getBlogById);

router.get("/author/:username", verifyToken, getBlogByAuthor);

router.put("/update/:blogId", verifyToken, updateBlog);

router.delete("/delete/:blogId", verifyToken, deleteBlog);

router.get("/search/:q", searchBlogs);

export default router;
