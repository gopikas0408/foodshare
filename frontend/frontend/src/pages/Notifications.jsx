import { useEffect, useState } from "react";
import API from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get("notifications/")
      .then((res) => setNotifications(res.data))
      .catch(() => alert("Unable to load notifications"));
  }, []);

  const markRead = async (id) => {
    try {
      await API.put(`notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch {
      alert("Unable to mark notification as read");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "new_request":
        return "🆕";
      case "request_accepted":
        return "✅";
      case "request_declined":
        return "❌";
      case "post_completed":
        return "🎉";
      case "request_cancelled":
        return "🚫";
      default:
        return "🔔";
    }
  };

  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="mb-4">
        <h5 className="fw-bold mb-0">Notifications</h5>
        <small className="text-muted">
          Stay updated on your food activity
        </small>
      </div>

      {notifications.length === 0 && (
        <p className="text-muted">No notifications available.</p>
      )}

      <div className="row g-3">
        {notifications.map((n) => (
          <div key={n.id} className="col-md-6">
            <div
              className={`card shadow-soft p-3 h-100 ${
                n.is_read ? "bg-light" : ""
              }`}
            >
              {/* TITLE */}
              <div className="d-flex align-items-start mb-2">
                <span className="me-2 fs-5">
                  {getIcon(n.type)}
                </span>
                <div>
                  <h6 className="fw-semibold mb-1">
                    {n.title}
                  </h6>
                  <p className="small text-muted mb-0">
                    {n.message}
                  </p>
                </div>
              </div>

              {/* ACTION */}
              {!n.is_read && (
                <button
                  className="btn btn-outline-success btn-sm mt-2"
                  onClick={() => markRead(n.id)}
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;