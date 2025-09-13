import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogByAuthor,
  updateBlog,
  deleteBlog,
  searchBlogs,
  likedBlogs,
  fetchLikes,
  getComments,
  addComments,
  deleteComment,
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

router.put("/update/:blogId", verifyToken, upload.single("image"), updateBlog);

router.delete("/delete/:blogId", verifyToken, deleteBlog);

router.get("/search/:q", searchBlogs);

router.post("/like/:blogId", verifyToken, likedBlogs);

router.get("/like/:blogId", verifyToken, fetchLikes);

router.get("/comments/:blogId", verifyToken, getComments);

router.post("/comments/:blogId", verifyToken, addComments);

router.delete("/comment/:blogId/:commentId", verifyToken, deleteComment);

export default router;
