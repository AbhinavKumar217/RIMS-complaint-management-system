import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Modal,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { apiWithAuth } from "../../../utils/ApiWrapper";
import Cookies from "js-cookie";

function ViewAllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  let user = null;
  const userInfo = Cookies.get("user");
  if (userInfo) {
    user = JSON.parse(userInfo);
  }
  let userId = null;
  if (user) {
    userId = user._id;
  }
  console.log(userId);
  const navigate = useNavigate();

  // Fetch complaints by user from the API
  useEffect(() => {
    const fetchAllComplaints = async () => {
      try {
        // Call the API to get the complaints for the user
        const response = await apiWithAuth.get(`/api/complaints`);

        // Set the complaints in the state
        setComplaints(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch user complaints:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiWithAuth.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await apiWithAuth.get("/api/users");
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchAllComplaints();
    fetchCategories();
    fetchUsers();

  }, []);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getContractorNameById = (contractorId) => {
    const contractor = users.find((cont) => cont._id === contractorId);
    console.log(contractorId);
    console.log(contractor);
    return contractor ? contractor.username : "N/A";
  };

  // Handle navigation to the single complaint page
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  // Handle closing the modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const handleDeleteButtonClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDeleteModal(true);
  };

  // Handle confirming the deletion of the selected complaint
  const handleConfirmDelete = async () => {
    try {
      // Call the API to delete the complaint
      await apiWithAuth.delete(
        `/api/complaints/admin/${selectedComplaint._id}`
      );

      // Refresh the complaints list after deletion
      const response = await apiWithAuth.get("/api/complaints");
      setComplaints(response.data);

      // Close the delete confirmation modal
      setShowDeleteModal(false);
      setSelectedComplaint(null);
      alert("Complaint deleted successfully!");
    } catch (error) {
      console.error("Failed to delete complaint:", error);
      alert("Failed to delete complaint. Please try again.");
    }
  };

  // Handle closing the delete confirmation modal
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedComplaint(null);
  };

  return (
    <Container style={{ width: "60%", minHeight:"91vh" }}>
      <h2 className="mb-4">My Complaints</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Complaint Image</th>
            <th>S.No</th>
            <th>Description</th>
            <th>Address</th>
            <th>Status</th>
            <th>Category</th>
            <th>Assigned Contractor</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint._id}>
              <td>
                <img
                  src={complaint.complaintImageUrl}
                  alt="Complaint"
                  height={50}
                  width={50}
                />
              </td>
              <td>{index + 1}</td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => handleComplaintClick(complaint)}
              >
                {complaint.description}
              </td>
              <td>{complaint.address}</td>
              <td>{complaint.status}</td>
              <td>{getCategoryNameById(complaint.category)}</td>
              <td>{getContractorNameById(complaint.contractor)}</td>
              <td>{complaint.review}</td>
              <td>{complaint.rating}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteButtonClick(complaint)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal for displaying complaint details */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        style={{ width: "100vw" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <Card>
              <Card.Body>
                <Row>
                  {/* Complaint image */}
                  <Col md={4}>
                    <Card.Img
                      height="100px"
                      variant="left"
                      src={selectedComplaint.complaintImageUrl}
                      alt="Complaint"
                    />
                  </Col>
                  {/* Complaint details */}
                  <Col md={8}>
                    <Card.Title>{selectedComplaint.description}</Card.Title>
                    <Card.Text>
                      <strong>Address:</strong> {selectedComplaint.address}
                      <br />
                      <strong>Status:</strong> {selectedComplaint.status}
                      <br />
                      <strong>Category:</strong> {selectedComplaint.category}
                      <br />
                      <strong>Assigned Contractor:</strong>{" "}
                      {selectedComplaint.contractor}
                      <br />
                      <strong>Review:</strong> {selectedComplaint.review}
                      <br />
                      <strong>Rating:</strong> {selectedComplaint.rating}
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this complaint?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
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

export default ViewAllComplaints;
