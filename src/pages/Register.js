import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
      setSuccess("");

    if (name === "") {
       setError("Name is required");
      return;
    }

   if (email === "") {
      setError("Email is required");
      return;
    }

  if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

if (phone === "") {
      setError("Phone is required");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      setError("Please enter only numbers in phone");
      return;
    }

    if (phone.length < 10) {
      setError("Phone number must contain at least 10 digits");
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
    if (confirmPassword === "") {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name, email, password, phone
            
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      setSuccess(data.message);
       localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-box">

        <h1 className="form-title">Create Account</h1>
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

        <form onSubmit={handleSubmit}>
          <label>Name</label>

          <input type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}/>

          <br />
          <label>Email</label>

          <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

          <br />
          <label>Phone</label>

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}/>

          <br/>
           <label>Password</label>

          <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br/>

          
          <label>Confirm Password</label>

       <input
         type="password"
         value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            } />

          <br/>

          
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;