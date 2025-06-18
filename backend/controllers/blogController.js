import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const createBlog = async (req, res) => {
  const { title, description, content, image } = req.body;
  const author = req.user.id;

  console.log("Here we are");
  console.log("Author : ", author);

  if (!title || !description || !author || !content) {
    return res
      .status(400)
      .json({ message: "Title, description and author are required" });
  }

  try {
    const newBlog = new Blog({
      title,
      description,
      content,
      image,
      author,
    });
    await newBlog.save();
    console.log("Saved");
    res.status(201).json({ message: "Blog created successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error creating blog in server side",
      error: err.message,
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("author", "username");
    console.log(blogs);
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

export const getBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId).populate("author", "username");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog by ID" });
  }
};

export const getBlogByAuthor = async (req, res) => {
  const { username } = req.params;
  console.log("Username : ", username);
  try {
    const user = await User.findOne({
      username: new RegExp(`${username}$`, "i"),
    });
    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }
    const blogs = await Blog.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username");
    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No blogs found for this author" });
    }
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs by author" });
  }
};

export const updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { title, description, content, image } = req.body;
  const userId = req.user.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this blog" });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (image) blog.image = image;

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating blog" });
  }
};

export const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ messsage: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: err.message });
  }
};
