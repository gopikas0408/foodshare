import { useEffect, useState } from "react";
import API from "../services/api";

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    API.get("requests/incoming/")
      .then((res) => setRequests(res.data))
      .catch(() => alert("Unable to load requests"));
  }, []);

  const updateStatus = async (id, action) => {
    setLoadingId(id);
    try {
      await API.put(`requests/${id}/${action}/`);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status:
                  action === "accept"
                    ? "accepted"
                    : action === "decline"
                    ? "declined"
                    : action === "complete"
                    ? "completed"
                    : r.status,
              }
            : r
        )
      );
    } catch {
      alert("Action failed");
    }
    setLoadingId(null);
  };

  const cancelAssignment = async (id) => {
    if (!window.confirm("Cancel this assignment and make food available again?")) {
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
      alert("Unable to cancel assignment");
    }
    setLoadingId(null);
  };

  const badgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "accepted":
        return "bg-success";
      case "completed":
        return "bg-secondary";
      case "declined":
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="mb-4">
        <h5 className="fw-bold mb-1">Incoming Requests</h5>
        <small className="text-muted">
          Manage food requests from people
        </small>
      </div>

      {requests.length === 0 && (
        <p className="text-muted">No incoming requests.</p>
      )}

      <div className="row g-3">
        {requests.map((req) => (
          <div key={req.id} className="col-md-6 col-lg-4">
            <div className="card shadow-soft p-3 h-100">
              {/* FOOD */}
              <h6 className="fw-semibold mb-1 text-truncate">
                🍽 {req.post.title}
              </h6>

              {/* REQUESTER */}
              <p className="small text-muted mb-1">
                Requested by <b>{req.requester.name}</b>
              </p>

              {/* MESSAGE */}
              <p className="small mb-2">
                <b>Message:</b>{" "}
                {req.message || "No message provided"}
              </p>

              {/* STATUS */}
              <span className={`badge mb-3 ${badgeClass(req.status)}`}>
                {req.status}
              </span>

              {/* ACTIONS */}
              {req.status === "pending" && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm w-50"
                    disabled={loadingId === req.id}
                    onClick={() => updateStatus(req.id, "accept")}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm w-50"
                    disabled={loadingId === req.id}
                    onClick={() => updateStatus(req.id, "decline")}
                  >
                    Decline
                  </button>
                </div>
              )}

              {req.status === "accepted" && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm w-50"
                    disabled={loadingId === req.id}
                    onClick={() => updateStatus(req.id, "complete")}
                  >
                    Pickup Completed
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm w-50"
                    disabled={loadingId === req.id}
                    onClick={() => cancelAssignment(req.id)}
                  >
                    Cancel Assignment
                  </button>
                </div>
              )}

              {req.status === "completed" && (
                <small className="text-success d-block mt-2">
                  ✅ Pickup completed successfully
                </small>
              )}

              {(req.status === "declined" ||
                req.status === "cancelled") && (
                <small className="text-muted d-block mt-2">
                  Action already completed
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingRequests;