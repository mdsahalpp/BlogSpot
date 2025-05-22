import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  const { title, description, image } = req.body;
  const author = req.userId;
  try {
    const newBlog = new Blog({
      title,
      description,
      image,
      author,
    });
    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating blog in server side" });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};
