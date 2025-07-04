import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./blog.css";
import AuthContext from "../../context/authContext";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [author, setAuthor] = useState("");
  const [openOpt, setOpenOpt] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`http://localhost:5000/blog/${id}`);
        setBlog(res.data);
        setAuthor(res.data.author.username);
        console.log("Fetched blog: ", res.data.author.username);
        console.log("user : ", user);
        if (user.id === res.data.author._id) {
          setOpenOpt(true);
        }
      } catch (err) {
        setError("Failed to load blog");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user]);

  const deleteBlog = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(
        `http://localhost:5000/blog/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Blog deleted successfully: ", res.data);
    } catch (err) {
      console.error("Error deleting blog: ", err);
    }
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div className="blog">
      <div className="blog-container">
        <h1>{blog.title}</h1>
        <p>{blog.description}</p>
        <div className="img-container">
          <img src={blog.image} />
        </div>
        <p>{blog.content}</p>
      </div>
      {openOpt ? (
        <div className="author-opt">
          <img
            id="three-dot"
            src="/option.png"
            alt="options"
            onClick={toggleDropdown}
          />
          {isOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <img src="/write.png" alt="edit" />
                <span className="tooltip-text">edit</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  setConfirmDelete(true);
                  if (confirmDelete) {
                    deleteBlog();
                  }
                }}
              >
                <img src="/delete.png" alt="delete" />
                <span className="tooltip-text">delete</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {confirmDelete && (
        <div className="confirm-dlt">
          <div className="confirm-dlt-opt">
            <p>Are you sure you want to delete this blog?</p>
            <div className="confirm-opt-btn">
              <button
                onClick={() => {
                  deleteBlog();
                  setConfirmDelete(false);
                }}
              >
                Yes
              </button>
              <button onClick={() => setConfirmDelete(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
