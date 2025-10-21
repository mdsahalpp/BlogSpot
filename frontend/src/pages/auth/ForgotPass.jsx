import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="l-page">
      <div className="form-cont">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit} className="l-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder={error || "Enter your email"}
            style={{ marginBottom: "12px" }}
          />
          {status && <p style={{ color: "green" }}>{status}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="l-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
          <Link className="s-link" to={"/login"}>
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
