import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    API.get("posts/my-posts/").then((res) => setPosts(res.data));
    API.get("requests/my/").then((res) => setRequests(res.data));
    API.get("notifications/unread-count/").then(
      (res) => setNotifications(res.data.unread_count)
    );
  }, []);

  return (
    <div className="container my-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0">Dashboard</h5>
          <small className="text-muted">
            Welcome back, {user?.name}
          </small>
        </div>

        <div>
          <button
            className="btn btn-success btn-sm me-2 px-3"
            onClick={() => navigate("/create-post")}
          >
            + Share Food
          </button>
          <button
            className="btn btn-outline-danger btn-sm px-3"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="row g-3 mb-4">
        <StatCard
          title="My Posts"
          value={posts.length}
          onClick={() => navigate("/dashboard")}
        />

        <StatCard
          title="My Requests"
          value={requests.length}
          onClick={() => navigate("/my-requests")}
        />

        <StatCard
          title="Notifications"
          value={notifications}
          onClick={() => navigate("/notifications")}
        />
      </div>

      {/* MY POSTS */}
      <h6 className="fw-bold mb-3">My Food Posts</h6>

      {posts.length === 0 && (
        <p className="text-muted small">No food posts yet.</p>
      )}

      <div className="row g-3">
        {posts.map((post) => {
          const imageUrl =
            post.images?.length > 0
              ? `http://127.0.0.1:8000${post.images[0].image}`
              : "https://via.placeholder.com/300x200?text=No+Image";

          return (
            <div key={post.id} className="col-md-4 col-sm-6">
              <div className="card shadow-soft h-100">
                <img
                  src={imageUrl}
                  alt="Food"
                  className="card-img-top"
                  style={{
                    height: "160px",
                    objectFit: "cover",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                  }}
                />

                <div className="card-body p-3">
                  <h6 className="fw-semibold text-truncate mb-1">
                    {post.title}
                  </h6>

                  <span className="badge bg-success text-capitalize">
                    {post.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

/* STAT CARD COMPONENT */
const StatCard = ({ title, value, onClick }) => (
  <div className="col-md-4">
    <div
      className="card shadow-soft p-3 text-center h-100"
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-3px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      <small className="text-muted">{title}</small>
      <h4 className="fw-bold text-success mt-1">{value}</h4>
      <small className="text-muted">View details</small>
    </div>
  </div>
);

export default Dashboard;