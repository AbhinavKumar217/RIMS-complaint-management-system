import React, { useState } from "react";
import { apiWithoutAuth } from "../../utils/ApiWrapper";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = { email, password };
      const response = await apiWithoutAuth.post("/api/feedback/auth/login", userData);

      // Store user data in cookies
      const expiresInOneHour = { expires: 1 / 24 };
      Cookies.set(
        "faculty",
        JSON.stringify(response.data.visibleFaculty),
        expiresInOneHour
      );
      Cookies.set("facultyToken", response.data.token, expiresInOneHour);

      navigate("/facultyComplaint");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container style={{
        height:"91vh"
    }}>
      <Container
        style={{
          width: "80%",
          backgroundColor: "grey",
          minHeight: "40vw",
          justifyContent: "center",
          borderRadius: "20px",
          paddingTop: "7vw",
        }}
      >
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="mb-4">Faculty Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Login;
