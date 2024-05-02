import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { apiWithAuth, apiWithoutAuth } from "../../../utils/ApiWrapper";
import Cookies from "js-cookie";

function UpdateComplaintSingle() {
  const { complaintId } = useParams(); // Get the complaint ID from the URL
  const [complaint, setComplaint] = useState({});
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [complaintImageUrl, setComplaintImageUrl] = useState("");
  const navigate = useNavigate();

  // Fetch the complaint details using the complaint ID
  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        // Fetch complaint details using the complaint ID
        const response = await apiWithAuth.get(
          `/api/complaints/${complaintId}`
        );

        setComplaint(response.data);
        // Pre-fill the form with current details
        setDescription(response.data.description);
        setAddress(response.data.address);
        setCategory(response.data.category);
        setComplaintImageUrl(response.data.complaintImageUrl);
      } catch (error) {
        console.error("Failed to fetch complaint details:", error);
      }
    };

    fetchComplaintDetails();
  }, [complaintId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "rimsCMS");
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    fetch("https://api.cloudinary.com/v1_1/dkjkh5oom/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setComplaintImageUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedComplaint = {
        description,
        address,
        category,
        complaintImageUrl,
      };

      // Call the API to update the complaint
      await apiWithAuth.put(`/api/complaints/${complaintId}`, updatedComplaint);

      // Navigate back to the user's complaints list page
      navigate("/user/complaints");
    } catch (error) {
      console.error("Failed to update complaint:", error);
    }
  };

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
      <h2 className="mb-4">Update Complaint</h2>
      <Container
        style={{
          backgroundColor: "grey",
          minHeight: "40vw",
          display: "flex",
          justifyContent: "center",
          borderRadius: "20px",
          paddingTop: "7vw",
          paddingBottom: "7vw",
          marginBottom: "3vw",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter complaint description"
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complaint address"
              required
            />
          </Form.Group>

          <Form.Group controlId="formCategory" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formImageUpload" className="mb-3">
            <Form.Label>Complaint Picture</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Button
              variant="primary"
              onClick={handleImageUpload}
              className="mt-2"
            >
              Upload Image
            </Button>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update Complaint
          </Button>
        </Form>
      </Container>
    </Container>
  );
}

export default UpdateComplaintSingle;
