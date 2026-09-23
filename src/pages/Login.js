import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    if (email === "") {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password === "") {
      setError("Password is required");
      return;
    }

    if (password.length < 4) {
      setError("Password must contain at least 4 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user",
        JSON.stringify(data.user)
      );
      setTimeout(() => {
       navigate("/products");
      }, 1000);

    } catch (error) {
    setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">

      <div className="form-box">

        <h1 className="form-title">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>

          <input type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "green" }}>
            {success}
          </p>
        )}

        <p>
          If you don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;