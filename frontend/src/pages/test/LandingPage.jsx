import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/authContext";

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/home");
      return;
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="base">
      <h1>Welcome to blogSpot</h1>
      <button onClick={handleClick}>Let's start</button>
    </div>
  );
};
export default LandingPage;
