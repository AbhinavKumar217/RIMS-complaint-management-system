import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { apiWithAuth } from "../../../utils/ApiWrapper";

function ManageFaculty() {
  const [facultys, setFacultys] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departments, setDepartments] = useState([]);

  // Fetch all users except admin role users from the API
  useEffect(() => {
    const fetchFacultys = async () => {
      try {
        const response = await apiWithAuth.get("/api/feedback/faculty/");
        setFacultys(response.data);
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await apiWithAuth.get("/api/feedback/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchFacultys();
    fetchDepartments();
  }, []);

  const getDepartmentNameById = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : "Unknown";
  };

  // Handle opening the delete confirmation modal for a selected user
  const handleDeleteButtonClick = (faculty) => {
    setSelectedFaculty(faculty);
    setShowDeleteModal(true);
  };

  // Handle confirming the deletion of the selected user
  const handleConfirmDelete = async () => {
    try {
      // Call the deleteByAdmin API to delete the user
      await apiWithAuth.delete(`/api/feedback/faculty/admin/${selectedFaculty._id}`);

      // Refresh the users list after deletion
      const response = await apiWithAuth.get("/api/feedback/faculty/");
      setFacultys(response.data);

      // Close the modal
      setShowDeleteModal(false);
      alert("Faculty deleted successfully!");
    } catch (error) {
      console.error("Failed to delete faculty:", error);
      alert("Failed to delete faculty. Please try again.");
    }
  };

  // Handle closing the delete confirmation modal
  const handleModalClose = () => {
    setShowDeleteModal(false);
    setSelectedFaculty(null);
  };

  return (
    <Container style={{ width: "80%", minHeight: "91vh" }}>
      <h2 className="mb-4">Manage Faculty</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {facultys.map((faculty) => (
            <tr key={faculty._id}>
              <td>{faculty.username}</td>
              <td>{faculty.email}</td>
              <td>{getDepartmentNameById(faculty.department)}</td>
              <td>{faculty.firstName}</td>
              <td>{faculty.lastName}</td>
              <td>{faculty.dob}</td>
              <td>{faculty.address}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteButtonClick(faculty)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {selectedFaculty?.username}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
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

export default ManageFaculty;
