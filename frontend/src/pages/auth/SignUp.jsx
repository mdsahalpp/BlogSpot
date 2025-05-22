import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPass) {
      setError("Please fill all the blanks");
      return;
    }

    if (password !== confirmPass) {
      setError("Password not match");
      confirmPass("");
      return;
    }

    const userData = { username, email, password };

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signup",
        userData
      );
      alert(response.data.message);
      navigate("/home");
    } catch (err) {
      console.error("Something went wrong");
    }
  };

  return (
    <div>
      <h1>SignUp page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <label htmlFor="confirmPass">Confirm Password</label>
        <input
          id="confirmPass"
          type="password"
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="Confirm password"
        />
        <Link to={"/login"}>Already have an account?</Link>

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};
export default SignUp;
