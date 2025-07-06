import Blog from "../models/Blog.js";
import User from "../models/User.js";

export const createBlog = async (req, res) => {
  const { title, description, content } = req.body;
  const author = req.user.id;

  if (!title || !description || !author) {
    return res
      .status(400)
      .json({ message: "Title, description and author are required" });
  }

  try {
    const imgUrl = req.file.path;
    const newBlog = new Blog({
      title,
      description,
      content,
      image: imgUrl,
      author,
    });
    await newBlog.save();
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
  const { title, description, content } = req.body;
  const image = req.file.path;
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

export const searchBlogs = async (req, res) => {
  const { q } = req.params;
  try {
    const user = await User.findOne({ username: q });

    const query = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        ...(user ? [{ author: user._id }] : []),
      ],
    };

    const blogs = await Blog.find(query).populate("author", "username");
    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.status(200).json(blogs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error searching blogs", error: err.message });
  }
};
