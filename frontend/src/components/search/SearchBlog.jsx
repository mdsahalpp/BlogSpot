import axios from "axios";
import API from "../../../api.js";
import React, { useEffect, useState } from "react";
import BlogCard from "../blogCard/BlogCard";

const SearchBlog = ({ searchTerm }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    console.log("Search term : ", searchTerm);
    const fetchBlogs = async () => {
      try {
        const response = await API.get(`/blog/search/${searchTerm}`);
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs: ", err);
        setBlogs([]);
      }
    };
    if (searchTerm.trim() !== "") {
      fetchBlogs();
    }
  }, [searchTerm]);

  if (blogs.length === 0) {
    return <div>No blogs found for "{searchTerm}"</div>;
  }

  return (
    <div className="base">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          title={blog.title}
          description={blog.description}
          image={blog.image}
          author={blog.author.username}
        />
      ))}
    </div>
  );
};

export default SearchBlog;
