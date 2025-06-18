import axios from "axios";
import React, { useEffect, useState } from "react";

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/blog");
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Blogs here</h1>
      {blogs.map((blog) => (
        <div key={blog._id} className="blog">
          <h2>{blog.title}</h2>
          <p>by {blog.author?.username || "unknown"}</p>
          <p>{blog.description}</p>
          <img src={blog.image} alt={blog.title} />
        </div>
      ))}
    </div>
  );
};

export default ListBlogs;
