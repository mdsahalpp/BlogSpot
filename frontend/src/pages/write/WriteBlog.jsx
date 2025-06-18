import axios from "axios";
import React, { useEffect, useState } from "react";
import "./writeBlog.css";

const writeBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  return (
    <div className="writeBlog">
      <h1>Here you write the blog</h1>
      <form>
        <div className="formGroup">
          <textarea
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
            required
          />
          <div>
            {/* If a image choosed to upload it should showed in this section. If no image choosed should not change the structure */}
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the description"
            required
          />
          <div className="bottomButtons">
            <input type="file" name="formImg" id="formImg" />
            <button id="submit" type="submit">
              Upload
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default writeBlog;
