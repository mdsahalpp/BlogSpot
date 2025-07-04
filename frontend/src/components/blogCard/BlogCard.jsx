import { useNavigate } from "react-router-dom";
import "./blogCard.css";

const BlogCard = ({ id, title, description, author, image }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="blog-card" onClick={handleClick}>
      <div className="blog-content">
        <h2>{title}</h2>
        <p className="blog-author">by {author}</p>
      </div>
      <div className="img-cont">
        {image && <img src={image} alt={title} className="blog-image" />}
      </div>
    </div>
  );
};

export default BlogCard;
