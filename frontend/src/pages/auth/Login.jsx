import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext.jsx";

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

    const userData = { email, password };

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        userData
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate("/home");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        alert(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1>Login page</h1>
      <form onSubmit={handleSubmit}>
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
        <Link to={"/signup"}>Create new account?</Link>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Login;
