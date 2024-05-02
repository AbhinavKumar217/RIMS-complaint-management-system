import React, { useState, useEffect } from "react";
import { apiWithoutAuth } from "../../utils/ApiWrapper";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [address, setAddress] = useState("");

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all categories from the API
    const fetchDepartments = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/feedback/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to the registration API endpoint
      const response = await apiWithoutAuth.post(
        "/api/feedback/auth/register",
        {
          username,
          email,
          password,
          departmentId,
          firstName,
          lastName,
          dob,
          address,
        }
      );

      // If registration is successful, navigate to the verify email page
      if (response.data.message === "Faculty registered successfully.") {
        alert("Registration successful! Please login.");
        navigate("/login");
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

              <Form.Group controlId="formDepartment" className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                >
                  <option value={null}>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formFirstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formLastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDob" className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="Date of Birth"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formAddress" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  required
                />
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
