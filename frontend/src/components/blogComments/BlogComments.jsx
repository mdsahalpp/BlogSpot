import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Textarea from "../subs/autoGrowTextarea/Textarea.jsx";
import AuthContext from "../../context/authContext.jsx";
import "./blogComments.css";

const BlogComments = ({ blogAuthor, blogId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/blog/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments : ", err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/blog/comments/${id}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment : ", err);
    }
  };

  const handleDeleteButton = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/blog/comment/${blogId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.error("Error deleting comment : ", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);
  return (
    <div className="comment-section">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        id="cmt-icon"
      >
        <img src="/comment.png" alt="comments" />
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Comments</h2>
        <div className="input-items">
          <Textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
          <button onClick={handlePostComment}>
            <img src="/send.png" alt="snd" />
          </button>
        </div>
        {comments.length > 0 ? (
          comments.map((c, i) => {
            const canDelete =
              c.user?._id === user._id || blogAuthor === user._id;
            return (
              <div key={i} className="comment-item">
                <p id="username">{c.user?.username || "User"}</p>
                <p id="comment-text">{c.text}</p>
                {canDelete && (
                  <div className="dlt-cmt">
                    <button
                      onClick={() => {
                        handleDeleteButton(c._id);
                      }}
                    >
                      <img src="/delete.png" alt="delete" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
};
export default BlogComments;
