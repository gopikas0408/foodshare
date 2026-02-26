import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "meals",
    quantity: "",
    pickup_location: "",
    available_until: "",
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setError("At least one image is required");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    images.forEach((img) => data.append("images", img));

    try {
      await API.post("posts/create/", data);
      navigate("/dashboard");
    } catch {
      setError("Failed to create post");
    }
  };

  return (
    <div className="container mt-4">
      <h4>Create Food Post</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          className="form-control mb-2"
          name="title"
          placeholder="Food Title"
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <select
          className="form-control mb-2"
          name="category"
          onChange={handleChange}
        >
          <option value="meals">Meals</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="bread">Bread</option>
          <option value="dairy">Dairy</option>
          <option value="other">Other</option>
        </select>

        <input
          className="form-control mb-2"
          name="quantity"
          placeholder="Quantity (e.g. 2 servings)"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="pickup_location"
          placeholder="Pickup Location"
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          className="form-control mb-2"
          name="available_until"
          onChange={handleChange}
          required
        />

        <input
          type="file"
          className="form-control mb-3"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button className="btn btn-success w-100">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;