import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    API.get(`posts/${id}/`)
      .then((res) => setPost(res.data))
      .catch(() => setError("Unable to load post"));
  }, [id]);

  if (!post) {
    return <div className="container mt-4">Loading...</div>;
  }

  const imageUrl =
    post.images?.length > 0
      ? `http://127.0.0.1:8000${post.images[0].image}`
      : "https://via.placeholder.com/800x400?text=No+Image";

  const handleRequestFood = async () => {
    setError("");
    setSuccess("");

    if (post.status !== "available") {
      setError("This food is no longer available.");
      return;
    }

    setLoading(true);
    try {
      await API.post("requests/create/", {
        post_id: post.id,
        message,
      });

      setSuccess("Food request sent successfully!");
      setMessage("");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "You already requested this food or an error occurred."
      );
    }
    setLoading(false);
  };

  return (
    <div className="container my-4">

      {/* HERO IMAGE */}
      <div className="card shadow-soft mb-4">
        <img
          src={imageUrl}
          alt="Food"
          className="img-fluid rounded"
          style={{ maxHeight: "380px", objectFit: "cover" }}
        />
      </div>

      <div className="row g-4">

        {/* LEFT CONTENT */}
        <div className="col-lg-8">
          <div className="card shadow-soft p-4">
            <h4 className="fw-bold mb-2">{post.title}</h4>

            <div className="mb-3">
              <span className="badge bg-success me-2 text-capitalize">
                {post.category}
              </span>
              <span className="badge bg-primary text-capitalize">
                {post.status}
              </span>
            </div>

            <InfoRow label="Description" value={post.description} />
            <InfoRow label="Quantity" value={post.quantity} />
            <InfoRow label="Pickup Location" value={post.pickup_location} />

          </div>
        </div>

        {/* RIGHT REQUEST CARD */}
        <div className="col-lg-4">
          <div className="card shadow-soft p-3 sticky-top" style={{ top: "90px" }}>
            <h6 className="fw-bold mb-2">Request This Food</h6>

            <textarea
              className="form-control input-rounded mb-2"
              rows="4"
              placeholder="Write a message to the donor (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {error && (
              <div className="alert alert-danger py-1 small">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-1 small">
                {success}
              </div>
            )}

            <button
              className="btn btn-success w-100"
              disabled={loading || post.status !== "available"}
              onClick={handleRequestFood}
            >
              {loading ? "Sending..." : "Request Food"}
            </button>

            <small className="text-muted d-block mt-2 text-center">
              Exact pickup address shared after acceptance
            </small>
          </div>
        </div>

      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="mb-2">
    <small className="text-muted">{label}</small>
    <p className="mb-1 fw-medium">{value}</p>
  </div>
);

export default PostDetails;