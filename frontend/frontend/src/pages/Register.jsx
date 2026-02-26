import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    state: "",
    location: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FRONTEND PASSWORD VALIDATION
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const res = await API.post("auth/register/", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Email may already exist.");
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
          style={{ width: "100%", maxWidth: "440px" }}
        >
          <h4 className="fw-bold text-success text-center mb-1">
            FoodShare
          </h4>
          <p className="text-center text-muted mb-3">
            Create your account
          </p>

          {error && (
            <div className="alert alert-danger py-2 small">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control input-rounded mb-2"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />

            <input
              className="form-control input-rounded mb-2"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              className="form-control input-rounded mb-1"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            {/* PASSWORD HINT */}
            <small className="text-muted d-block mb-2">
              Password must be at least 8 characters
            </small>

            <input
              className="form-control input-rounded mb-2"
              name="city"
              placeholder="City"
              onChange={handleChange}
              required
            />

            <input
              className="form-control input-rounded mb-2"
              name="state"
              placeholder="State"
              onChange={handleChange}
              required
            />

            <input
              className="form-control input-rounded mb-3"
              name="location"
              placeholder="Location"
              onChange={handleChange}
              required
            />

            <button className="btn btn-success w-100 py-2">
              Register
            </button>
          </form>

          <p className="text-center mt-3 small">
            Already have an account?{" "}
            <Link to="/login" className="text-success fw-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;