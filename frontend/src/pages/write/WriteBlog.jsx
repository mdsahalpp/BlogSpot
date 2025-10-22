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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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

    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    setUploadProgress(0);

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
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      setSuccessMessage("Blog created successfully!");
      setTitle("");
      setDescription("");
      setContent("");
      setImage(null);
      setPreview(null);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Blog creation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="writeBlog">
      <h1>Here you write the blog</h1>
      <form onSubmit={handleSubmit}>
        <div className={`blogForm ${isLoading ? "loading" : ""}`}>
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
              <button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
          {isLoading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">Uploading... {uploadProgress}%</p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default writeBlog;
