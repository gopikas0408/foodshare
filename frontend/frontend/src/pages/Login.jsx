import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="auth-bg"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1593113598332-cd288d649433)",
      }}
    >
      <div className="auth-overlay"></div>

      <div className="auth-content d-flex align-items-center justify-content-center min-vh-100">
        <div
          className="card shadow-soft p-4"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <h4 className="fw-bold text-success text-center mb-1">
            FoodShare
          </h4>
          <p className="text-center text-muted mb-3">
            Welcome back 👋
          </p>

          {error && (
            <div className="alert alert-danger py-2 small">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control input-rounded mb-3"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="form-control input-rounded mb-3"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn btn-success w-100 py-2">
              Login
            </button>
          </form>

          <p className="text-center mt-3 small">
            Don’t have an account?{" "}
            <Link to="/register" className="text-success fw-bold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;