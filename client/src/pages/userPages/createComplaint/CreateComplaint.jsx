import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { apiWithoutAuth, apiWithAuth } from "../../../utils/ApiWrapper";
import Cookies from "js-cookie";

function CreateComplaint() {
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [complaintImageUrl, setComplaintImageUrl] = useState("");
  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState("");
  const navigate = useNavigate();

  // Fetch categories from the API
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

    // Prepare the complaint data
    const complaintData = {
      description,
      address,
      category,
      complaintImageUrl,
    };

    try {
      // Get the bearer token from cookies
      const token = Cookies.get("token");

      // Make an API request to create the complaint
      await apiWithAuth.post("/api/complaints", complaintData);

      // Navigate to another page after successful complaint creation (e.g., complaint list)
      navigate("/user/complaints");
    } catch (error) {
      console.error("Failed to create complaint:", error);
    }
  };

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4">Create Complaint</h2>
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
                  placeholder="Enter description"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formAddress" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
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
                  required
                />
                <Button
                  variant="primary"
                  onClick={handleImageUpload}
                  className="mt-2"
                >
                  Upload Image
                </Button>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Create Complaint
              </Button>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateComplaint;
