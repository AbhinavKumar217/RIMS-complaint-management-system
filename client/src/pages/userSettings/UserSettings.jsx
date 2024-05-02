import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import { apiWithAuth } from "../../utils/ApiWrapper";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function UserSettings() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [image, setImage] = useState("");

  const userInfo = Cookies.get("user");
  let user = null;
  if(userInfo) {
    user = JSON.parse(userInfo);
  }
  let userId = null;
  if(user) {
    userId = user._id;
  }

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the API
        const response = await apiWithAuth.get(`/api/users/${userId}`);

        // Set the form fields with the fetched user data
        setUsername(response.data.username);
        setPassword(""); // Do not pre-fill the password field for security reasons
        setUserImageUrl(response.data.userImageUrl);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "rimsCMS");
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    fetch("https://api.cloudinary.com/v1_1/dkjkh5oom/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUserImageUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Prepare user data to update
      const updatedUserData = {
        username,
        password,
        userImageUrl,
      };

      // Update user data in the API
      await apiWithAuth.put(`/api/users/${userId}`, updatedUserData);

      alert("User details updated successfully");
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  // Handle account deletion
  const handleConfirmDelete = async () => {
    try {
      // Delete user account from the API
      await apiWithAuth.delete(`/api/users/${userId}`);

      // Clear cookies and navigate to login
      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("role");
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete user account:", error);
    }
  };

  // Handle delete modal visibility
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleHideDeleteModal = () => setShowDeleteModal(false);

  return (
    <Container style={{ width: "60%", minHeight:"91vh" }}>
      <h2 className="mb-4">User Settings</h2>
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

        <Form.Group controlId="formImageUpload" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <Button
            variant="primary"
            onClick={handleImageUpload}
            className="mt-2"
          >
            Upload Image
          </Button>
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

export default UserSettings;
