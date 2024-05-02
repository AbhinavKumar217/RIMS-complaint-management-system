import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { apiWithoutAuth, apiWithAuth } from "../../utils/ApiWrapper";

function FacultyComplaint() {
  const [department, setDepartment] = useState("");
  const [unitName, setUnitName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();

  // Fetch categories from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/feedback/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the complaint data
    const facultyComplaintData = {
      department,
      unitName,
      complaint,
    };

    try {
      // Get the bearer token from cookies

      // Make an API request to create the complaint
      await apiWithAuth.post("/api/feedback/facultyComplaints/", facultyComplaintData);

      // Navigate to another page after successful complaint creation (e.g., complaint list)
      alert("Your complaint has been registered.");
      window.location.reload();
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

              <Form.Group controlId="formDepartment" className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formUnitName" className="mb-3">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="Enter Unit Name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formComplaint" className="mb-3">
                <Form.Label>Complaint</Form.Label>
                <Form.Control
                  type="text"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="Enter Complaint"
                  required
                />
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

export default FacultyComplaint;
