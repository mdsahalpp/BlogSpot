import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import "./signup.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPass) {
      setError("Please fill all the blanks");
      return;
    }

    if (password !== confirmPass) {
      setError("Password not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert("Verification email sent. Please check you inbox");

      const idToken = await userCredential.user.getIdToken();

      await axios.post("http://localhost:5000/auth/signup", {
        token: idToken,
      });
      signOut(auth);
    } catch (err) {
      console.error("Something went wrong", err);
      setError("SignUp failed");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const username =
        result.user.displayName?.replace(/\s+/g, "") ||
        result.user.email.split("@")[0];

      await axios.post("http://localhost:5000/auth/signup", {
        token: idToken,
        username,
      });
      navigate("/home");
    } catch (err) {
      console.log("Error : ", err);
      setError("Signup failed");
    }
  };
  return (
    <div className="s-page">
      <div className="form-data">
        <h1>SignUp : </h1>
        <form onSubmit={handleSubmit}>
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

          <button type="submit" id="s-btn">
            Sign up
          </button>
          <p>OR</p>
          <button onClick={handleGoogleSignup} id="g-btn">
            <img src="/google.png" alt="" />
            Signup with google
          </button>

          <Link id="l-btn" to={"/login"}>
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
