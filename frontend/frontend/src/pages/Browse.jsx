import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Browse = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("posts/")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Failed to load posts"));
  }, []);

  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="mb-4">
        <h5 className="fw-bold mb-1">Browse Available Food</h5>
        <small className="text-muted">
          Find food shared by people near you
        </small>
      </div>

      {/* EMPTY STATE */}
      {posts.length === 0 && (
        <p className="text-muted">No food available right now.</p>
      )}

      {/* FOOD CARDS */}
      <div className="row g-4">
        {posts.map((post) => {
          const imageUrl =
            post.images?.length > 0
              ? `http://127.0.0.1:8000${post.images[0].image}`
              : "https://via.placeholder.com/300x200?text=No+Image";

          return (
            <div key={post.id} className="col-lg-4 col-md-6">
              <div
                className="card shadow-soft h-100 browse-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {/* IMAGE */}
                <img
                  src={imageUrl}
                  alt="Food"
                  className="card-img-top"
                  style={{
                    height: "190px",
                    objectFit: "cover",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                  }}
                />

                {/* CONTENT */}
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-semibold text-truncate mb-0">
                      {post.title}
                    </h6>
                    <span className="badge bg-success text-capitalize">
                      {post.category}
                    </span>
                  </div>

                  <p className="small text-muted mb-2 text-truncate">
                    {post.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      📍 {post.pickup_location}
                    </small>

                    <span
                      className={`badge ${
                        post.status === "available"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Browse;