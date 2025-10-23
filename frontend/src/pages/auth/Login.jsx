import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext.jsx";
import { auth, googleProvider } from "../../firebase/firebase.js";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import "./login.css";
import API from "../../../api.js";

const Login = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all the blanks");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        alert("Please verify your email before logging...");
        return;
      }

      const token = await user.getIdToken();

      const response = await API.post(
        "/auth/login",
        {},
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        setError(data.message);
        alert(data.message);
      }
    } catch (err) {
      console.error("Login failed. Please check your credentials.", err);
      setError(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const token = await user.getIdToken();

      const response = await API.post(
        "/auth/login",
        { email: user.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      if (response.status === 200) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error in google login : ", err);
    }
  };

  return (
    <div className="l-page">
      <div className="form-cont">
        <h1>Login : </h1>
        <form onSubmit={handleSubmit} className="l-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder={error || "Enter email"}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder={error || "Enter password"}
          />
          <Link className="f-link" to={"/forgot-password"}>
            Forgot password?
          </Link>
          <p style={{ color: "red" }}>{error}</p>
          <button className="l-btn" type="submit">
            Login
          </button>
          <p>OR</p>
          <button id="g-btn" onClick={handleGoogleLogin}>
            <img src="/google.png" alt="" />
            Login with google
          </button>

          <Link className="s-link" to={"/signup"}>
            Create new account?
          </Link>
        </form>
      </div>
    </div>
  );
};
export default Login;
