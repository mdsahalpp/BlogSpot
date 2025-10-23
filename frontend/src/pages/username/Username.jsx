import "./username.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";

const Username = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      if (!username) {
        alert("You must enter a username");
        return;
      }
      const res = await API.put(
        "/user/username",
        { username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message);
      }
      console.error("Error : ", err);
    }
  };

  return (
    <div className="u-page">
      <div className="u-form">
        <h3>Enter Username</h3>
        <input
          placeholder="Enter the username"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Username;
