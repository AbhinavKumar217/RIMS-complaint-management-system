import React, { useState, useEffect } from "react";
import { apiWithoutAuth } from "../../utils/ApiWrapper";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState(null);
  const [userImageUrl, setUserImageUrl] = useState("");

  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all categories from the API
    const fetchCategories = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
        setUserImageUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to the registration API endpoint
      const response = await apiWithoutAuth.post("/api/auth/register", {
        username,
        email,
        password,
        role,
        category,
        userImageUrl,
      });

      // If registration is successful, navigate to the verify email page
      if (response.data.message === "User registered successfully") {
        alert("Registration successful! Please verify your email.");
        navigate("/verify-email");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration failure (e.g., display error message)
    }
  };

  return (
    <Container
      style={{
        height: "100vh",
      }}
    >
      <Container
        style={{
          width: "80%",
          backgroundColor: "grey",
          minHeight: "40vw",
          justifyContent: "center",
          borderRadius: "20px",
          paddingTop: "7vw",
          paddingBottom: "7vw",
          marginBottom: "3vw",
        }}
      >
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="mb-4">Register</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formRole" className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="user">User</option>
                  <option value="contractor">Contractor</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required={role === "contractor"}
                >
                  <option value={null}>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formImageUpload" className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
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

              <Button type="submit" variant="primary">
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Register;
