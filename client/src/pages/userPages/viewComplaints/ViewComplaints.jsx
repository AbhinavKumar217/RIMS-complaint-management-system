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
  Form,
} from "react-bootstrap";
import { apiWithAuth } from "../../../utils/ApiWrapper";
import Cookies from "js-cookie";

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
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
    const fetchUserComplaints = async () => {
      try {
        // Call the API to get the complaints for the user
        const response = await apiWithAuth.get(
          `/api/complaints/user/${userId}`
        );

        // Set the complaints in the state
        setComplaints(response.data.complaints);
        // setComplaints(response.data);
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

    fetchUserComplaints();
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
    setReview(complaint.review || "");
    setRating(complaint.rating || "");
    setShowModal(true);
  };

  // Handle closing the modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setReview("");
    setRating("");
    setHasSubmittedReview(false);
  };

  const handleSubmitReview = async () => {
    if (selectedComplaint) {
      try {
        // Call the review complaint API
        const response = await apiWithAuth.post(
          `/api/complaints/review/${selectedComplaint._id}`,
          {
            review,
            rating,
          }
        );

        if (response.status === 200) {
          alert("Review submitted successfully!");
          setHasSubmittedReview(true);
          // Optional: refresh complaints list
          const response = await apiWithAuth.get(
            `/api/complaints/user/${userId}`
          );
          setComplaints(response.data.complaints);
        } else {
          alert("Failed to submit review. Please try again.");
        }
      } catch (error) {
        console.error("Failed to submit review:", error);
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
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
            <>
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
              {(selectedComplaint.status === "solved" ||
                selectedComplaint.status === "failed") && (
                <Card className="mt-3">
                  <Card.Body>
                    <Form>
                      <Form.Group controlId="review" className="mb-3">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Leave your review here..."
                          disabled={hasSubmittedReview} // Disable after submission
                        />
                      </Form.Group>
                      <Form.Group controlId="rating" className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          type="number"
                          min={1}
                          max={5}
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          placeholder="Provide a rating from 1 to 5..."
                          disabled={hasSubmittedReview} // Disable after submission
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={handleSubmitReview}
                        disabled={hasSubmittedReview} // Disable after submission
                      >
                        Submit Review
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModalClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ViewComplaints;
