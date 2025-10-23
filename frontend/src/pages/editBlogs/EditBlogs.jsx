import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api";
import "./editBlogs.css";

const EditBlogs = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/blog/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setContent(res.data.content);
        setImage(res.data.image);
        setPreview(res.data.image);
      } catch (err) {
        console.error("Error fetching blog : ", err);
        setError("Failed to load blog");
      }
    };

    fetchBlog();
  }, []);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!title) {
        setError("Title required.");
      }

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("image", image);
      const res = await API.put(`/blog/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Blog updated.");
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error("Error updating blog : ", err);
      setError("Failed to update blog.");
    }
  };
  return (
    <div className="writeBlog">
      <h1>Here you can edit your blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="blogForm">
          <textarea
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
          />
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Description"
          />
          <div className="image-preview">
            {preview && <img src={preview} alt="selected image" />}
          </div>
          <textarea
            id="story"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="Story"
          />

          <div className="bottom-div">
            <div className="image-upload">
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImgChange}
              />
              <label htmlFor="imageInput">
                <img src="/image-.png" alt="add image" />
              </label>
            </div>
            <div className="publish-btn">
              <button
                id="cancel-btn"
                type="button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </button>
              <button id="update-btn" type="submit">
                Update
              </button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditBlogs;
