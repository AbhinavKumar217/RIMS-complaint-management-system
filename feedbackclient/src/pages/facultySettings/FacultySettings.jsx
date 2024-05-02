import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import { apiWithAuth, apiWithoutAuth } from "../../utils/ApiWrapper";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function FacultySettings() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [address, setAddress] = useState("");
  const [departments, setDepartments] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const facultyInfo = Cookies.get("faculty");
  console.log(facultyInfo);
  let faculty = null;
  if (facultyInfo) {
    faculty = JSON.parse(facultyInfo);
  }
  console.log(faculty);
  let facultyId = null;
  if (faculty) {
    facultyId = faculty._id;
  }
  console.log(facultyId);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/feedback/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();

    const fetchFacultyData = async () => {
      try {
        // Fetch user data from the API
        const response = await apiWithoutAuth.get(
          `/api/feedback/faculty/${facultyId}`
        );

        // Set the form fields with the fetched user data
        setUsername(response.data.username);
        setPassword(""); // Do not pre-fill the password field for security reasons
        setDepartmentId(response.data.department);
        setAddress(response.data.address);
      } catch (error) {
        console.error("Failed to fetch faculty data:", error);
      }
    };

    fetchFacultyData();
  }, []);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Prepare user data to update
      const updatedFacultyData = {
        username,
        password,
        departmentId,
        address,
      };

      // Update user data in the API
      await apiWithAuth.put(
        `/api/feedback/faculty/${facultyId}`,
        updatedFacultyData
      );

      alert("Faculty details updated successfully");
      navigate("/facultyComplaint");
    } catch (error) {
      console.error("Failed to update faculty details:", error);
    }
  };

  // Handle account deletion
  const handleConfirmDelete = async () => {
    try {
      // Delete user account from the API
      await apiWithAuth.delete(`/api/feedback/faculty/${facultyId}`);

      // Clear cookies and navigate to login
      Cookies.remove("faculty");
      Cookies.remove("facultyToken");
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete faculty account:", error);
    }
  };

  // Handle delete modal visibility
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleHideDeleteModal = () => setShowDeleteModal(false);

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
      <h2 className="mb-4">Faculty Settings</h2>
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
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Update
          </Button>

          {/* Delete account button */}
          <Button
            variant="danger"
            className="w-100 mt-3"
            onClick={handleShowDeleteModal}
          >
            Delete Account
          </Button>
        </Form>
      </Container>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={handleHideDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FacultySettings;
