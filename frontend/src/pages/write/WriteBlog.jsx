import axios from "axios";
import React, { useEffect, useState } from "react";
import "./writeBlog.css";

const writeBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required");
      return;
    }
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("content", content);

    try {
      await axios.post("http://localhost:5000/blog/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog created!");
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("Blog creation failed.");
    }
  };

  return (
    <div className="writeBlog">
      <h1>Here you write the blog</h1>
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
                onChange={handleImageChange}
              />
              <label htmlFor="imageInput">
                <img src="./image-.png" alt="add image" />
              </label>
            </div>
            <div className="publish-btn">
              <button>Publish</button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default writeBlog;
