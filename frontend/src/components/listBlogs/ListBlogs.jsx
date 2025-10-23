import axios from "axios";
import API from "../../../api.js";
import React, { useEffect, useState } from "react";
import BlogCard from "../blogCard/BlogCard";
import "./listBlogs.css";

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await API.get("/blog");
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading blogs: {error.message}</div>;
  if (blogs.length === 0) return <div>No blogs available</div>;
  return (
    <div className="list-blogs">
      <div className="list-container">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            author={blog.author.username}
            image={blog.image}
          />
        ))}
      </div>
    </div>
  );
};

export default ListBlogs;
