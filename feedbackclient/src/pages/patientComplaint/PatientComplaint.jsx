import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { apiWithoutAuth } from "../../utils/ApiWrapper";


function PatientComplaint() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [unitName, setUnitName] = useState("");
  const [wardName, setWardName] = useState("");
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
    const patientComplaintData = {
      name,
      age,
      sex,
      address,
      department,
      unitName,
      wardName,
      complaint,
    };

    try {
      // Get the bearer token from cookies


      // Make an API request to create the complaint
      await apiWithoutAuth.post("/api/feedback/patientComplaints/", patientComplaintData);

      // Navigate to another page after successful complaint creation (e.g., complaint list)
      alert("Your complaint has been registered.");
      navigate("/login");
    } catch (error) {
      console.error("Failed to create complaint:", error);
    }
  };

  return (
    <Container style={{ width: "70%", minHeight: "91vh" }}>
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
              width:"50vw",
            }}
          >
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formAge" className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter Age"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formSex" className="mb-3">
                <Form.Label>Sex</Form.Label>
                <Form.Control
                  as="select"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your sex</option>
                    <option value="Male">
                      Male
                    </option>
                    <option value="Female">
                      Female
                    </option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formAddress" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDepartment" className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select a department</option>
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

              <Form.Group controlId="formWardName" className="mb-3">
                <Form.Label>Ward Name</Form.Label>
                <Form.Control
                  type="text"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  placeholder="Enter Ward Name"
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

export default PatientComplaint;
