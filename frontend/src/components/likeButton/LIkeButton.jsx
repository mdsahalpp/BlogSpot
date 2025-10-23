import axios from "axios";
import { useEffect, useState } from "react";
import "./likeButton.css";
import { useParams } from "react-router-dom";
import API from "../../../api.js";

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const toggleLike = async () => {
    setLikeCount((prev) => prev + (liked ? -1 : 1));
    setLiked(!liked);

    const res = await API.post(
      `/blog/like/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLiked(res.data.liked);
  };
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const res = await API.get(`/blog/like/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikeCount(res.data.likes);
        setLiked(res.data.alreadyLiked);
      } catch (err) {
        console.error("Error : ", err);
      }
    };

    fetchLikeCount();
  }, []);
  return (
    <div className="container">
      <button
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={toggleLike}
      >
        <span className="heart">&#10084;</span>
      </button>
      <p className="count">{likeCount}</p>
    </div>
  );
};

export default LikeButton;
