import { useEffect, useState } from "react";
import API from "../services/api";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    API.get("requests/my/")
      .then((res) => setRequests(res.data))
      .catch(() => alert("Unable to load requests"));
  }, []);

  const cancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    setLoadingId(id);
    try {
      await API.put(`requests/${id}/cancel/`);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "cancelled" } : r
        )
      );
    } catch {
      alert("Unable to cancel request");
    }
    setLoadingId(null);
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "accepted":
        return "bg-success";
      case "completed":
        return "bg-secondary";
      case "declined":
        return "bg-danger";
      case "cancelled":
        return "bg-dark";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="mb-4">
        <h5 className="fw-bold mb-0">My Food Requests</h5>
        <small className="text-muted">
          Track all food requests you have sent
        </small>
      </div>

      {requests.length === 0 && (
        <p className="text-muted">
          You have not requested any food yet.
        </p>
      )}

      <div className="row g-3">
        {requests.map((req) => (
          <div key={req.id} className="col-md-6 col-lg-4">
            <div className="card shadow-soft p-3 h-100">
              {/* FOOD TITLE */}
              <h6 className="fw-semibold mb-1 text-truncate">
                🍽 {req.post.title}
              </h6>

              {/* DONOR */}
              <p className="small text-muted mb-2">
                Donor: <b>{req.post.donor_name}</b>
              </p>

              {/* STATUS */}
              <span
                className={`badge mb-3 text-capitalize ${getBadgeClass(
                  req.status
                )}`}
              >
                {req.status}
              </span>

              {/* ACTION */}
              {req.status === "pending" || req.status === "accepted" ? (
                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  disabled={loadingId === req.id}
                  onClick={() => cancelRequest(req.id)}
                >
                  {loadingId === req.id ? "Cancelling..." : "Cancel Request"}
                </button>
              ) : (
                <small className="text-muted text-center d-block">
                  No actions available
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;