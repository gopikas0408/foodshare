import { useEffect, useState } from "react";
import API from "../services/api";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("admin/users/").then((res) => setUsers(res.data));
    API.get("admin/posts/").then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Admin Panel</h3>

      <h5 className="mt-4">Users</h5>
      {users.map((u) => (
        <div key={u.id} className="card p-2 mb-2">
          {u.email}
        </div>
      ))}

      <h5 className="mt-4">Food Posts</h5>
      {posts.map((p) => (
        <div key={p.id} className="card p-2 mb-2">
          {p.title} – {p.status}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;