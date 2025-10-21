import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/authContext.jsx";

const Navbar = ({ onSearchChange }) => {
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [search, setSearch] = useState("");
  const debouncerTime = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    clearTimeout(debouncerTime.current);
    debouncerTime.current = setTimeout(() => {
      onSearchChange(value);
    }, 500);
  };

  return (
    <nav className="navbar">
      <div className="left">
        <h1 id="logoName">BlogSpot</h1>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="right">
        <Link to={"/donation"} className="navLink">
          <p id="donation-icon">Donation</p>
        </Link>
        <Link to={"/create"} className="navLink">
          <img src="./write.png" alt="write-icon" />
          <p>write</p>
        </Link>
        <Link to={"/notification"} className="navLink">
          <img src="./notification.png" alt="notification-icon" />
        </Link>
        <div
          className="navLink profile-wrapper"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img src="./user.png" alt="profile-icon" />
          {showDropdown && (
            <div className="dropProfile">
              <div className="logged-user">
                <p>{user?.username}</p>
                <button
                  id="logout-btn"
                  onClick={() => setShowConfirmation(true)}
                >
                  <img src="./logout.png" alt="logout" />{" "}
                </button>
              </div>
              <div className="login-btn">
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )}
          {showConfirmation && (
            <div className="confirmation-overlay">
              <div className="confirmation-dialog">
                <p>Are you sure you want to logout?</p>
                <div className="confirmation-buttons">
                  <button onClick={handleLogout}>Yes</button>
                  <button onClick={() => setShowConfirmation(false)}>No</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
