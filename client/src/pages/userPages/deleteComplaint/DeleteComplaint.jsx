import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { apiWithAuth } from "../../../utils/ApiWrapper";
import Cookies from "js-cookie";

function DeleteComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
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

  // Fetch complaints made by the user
  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        // Get complaints for the user using API
        const response = await apiWithAuth.get(
          `/api/complaints/user/${userId}`
        );

        setComplaints(response.data.complaints);
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

  // Handle the delete button click
  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setShowModal(true);
  };

  // Handle the confirmation of deletion
  const handleConfirmDelete = async () => {
    if (complaintToDelete) {
      try {
        // Call the API to delete the complaint
        await apiWithAuth.delete(`/api/complaints/${complaintToDelete._id}`);

        // Remove the complaint from the list
        setComplaints(
          complaints.filter((c) => c._id !== complaintToDelete._id)
        );

        // Hide the modal
        setShowModal(false);
      } catch (error) {
        console.error("Failed to delete complaint:", error);
      }
    }
  };

  // Handle the cancellation of deletion
  const handleCancelDelete = () => {
    setComplaintToDelete(null);
    setShowModal(false);
  };

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
      <h2 className="mb-4">Delete Complaint</h2>
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
              <td>{complaint.description}</td>
              <td>{complaint.address}</td>
              <td>{complaint.status}</td>
              <td>{getCategoryNameById(complaint.category)}</td>
              <td>{getContractorNameById(complaint.contractor)}</td>
              <td>{complaint.review}</td>
              <td>{complaint.rating}</td>
              <td>
                {/* Delete button */}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(complaint)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation modal */}
      <Modal show={showModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this complaint?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DeleteComplaint;
