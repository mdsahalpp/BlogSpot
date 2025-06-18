import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="left">
        <h1 id="logoName">BlogSpot</h1>
        <input type="text" placeholder="Search" />
      </div>
      <div className="right">
        <Link to={"/create"} className="navLink">
          <img src="./write.png" alt="write-icon" />
          <p>write</p>
        </Link>
        <Link to={"/notification"} className="navLink">
          <img src="./notification.png" alt="notification-icon" />
        </Link>
        <Link className="navLink">
          <img src="./user.png" alt="profile-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
