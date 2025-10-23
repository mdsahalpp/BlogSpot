import Navbar from "../../components/navbar/Navbar";
import BlogCard from "../../components/blogCard/BlogCard";
import AuthContext from "../../context/authContext";
import "./profile.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const Profile = () => {
  const [blogs, setBlogs] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBlogs = async () => {
      if (!user) return;
      try {
        const response = await API.get(`/blog/author/${user.username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs: ", err);
      }
    };
    fetchBlogs();
  }, [user]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="main">
      <Navbar />
      <div className="edit-profile" onClick={() => navigate("/username")}>
        {" "}
        Hi, {user.username}
      </div>
      <div className="own-blogs">
        {blogs.length > 0 ? (
          <div className="own-blogs-container">
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
        ) : (
          <p>NO blogs</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
