import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { apiWithAuth } from "../../../utils/ApiWrapper";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch all users except admin role users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiWithAuth.get("/api/users");
        const filteredUsers = response.data.filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
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

    fetchUsers();
    fetchCategories();
  }, []);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Handle opening the delete confirmation modal for a selected user
  const handleDeleteButtonClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Handle confirming the deletion of the selected user
  const handleConfirmDelete = async () => {
    try {
      // Call the deleteByAdmin API to delete the user
      await apiWithAuth.delete(`/api/users/admin/${selectedUser._id}`);

      // Refresh the users list after deletion
      const response = await apiWithAuth.get("/api/users");
      const filteredUsers = response.data.filter(
        (user) => user.role !== "admin"
      );
      setUsers(filteredUsers);

      // Close the modal
      setShowDeleteModal(false);
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Handle closing the delete confirmation modal
  const handleModalClose = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <Container style={{ width: "80%", minHeight: "91vh" }}>
      <h2 className="mb-4">Manage Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User Image</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <img
                  src={user.userImageUrl}
                  alt="User"
                  height={50}
                  width={50}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.role === "contractor" ? getCategoryNameById(user.category) : "N/A"}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteButtonClick(user)}
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
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {selectedUser?.username}?</p>
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

export default ManageUsers;
