import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Table,
  NavLink,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { apiWithAuth } from "../../utils/ApiWrapper";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const user = JSON.parse(Cookies.get("user") || "{}");
  let role = null;
  const roleString = Cookies.get("role");
  if (roleString) {
    role = JSON.parse(roleString);
  }
  let contractorId = null;
  if (role === "contractor") {
    contractorId = user._id;
    console.log(contractorId);
  }

  const fetchCategories = async () => {
    try {
      const response = await apiWithAuth.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchComplaintsByContractor = async () => {
    try {
      const response = await apiWithAuth.get(
        `/api/complaints/contractor/${contractorId}`
      );
      setComplaints(response.data.complaints);
      console.log(response.data.complaints);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
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

  useEffect(() => {
    fetchCategories();
    if (role === "contractor") {
      fetchComplaintsByContractor();
      fetchUsers();
    }
  }, []);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getUserNameById = (userId) => {
    const user = users.find((us) => us._id === userId);
    return user ? user.username : "Unknown";
  };

  // Function to handle complaint solved action
  const handleSolved = async (complaintId) => {
    try {
      await apiWithAuth.post(`/api/complaints/solved/${complaintId}`);
      alert("Complaint marked as solved successfully!");
      // Refresh complaints data after updating
      fetchComplaintsByContractor();
    } catch (error) {
      console.error("Failed to mark complaint as solved:", error);
    }
  };

  // Function to handle complaint failed action
  const handleFailed = async (complaintId) => {
    try {
      await apiWithAuth.post(`/api/complaints/failed/${complaintId}`);
      alert("Complaint marked as failed successfully!");
      // Refresh complaints data after updating
      fetchComplaintsByContractor();
    } catch (error) {
      console.error("Failed to mark complaint as failed:", error);
    }
  };

  return (
    <Container style={{ maxWidth: "70%" }}>
      {/* User Information Panel */}
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
        <Card className="my-3" style={{ height: "300px", minWidth: "80%" }}>
          <Card.Body className="d-flex align-items-center">
            {/* User Profile Image */}
            <div style={{ width: "20%" }}>
              <img
                src={user.userImageUrl}
                alt="User Profile"
                className="rounded-circle"
                style={{ width: "120px", height: "120px" }}
              />
            </div>

            {/* User Info */}
            <div style={{ marginLeft: "50px" }}>
              <h3>{user.username}</h3>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Role:</b> {role}
              </p>
              {role === "contractor" && (
                <p>
                  <b>Category:</b> {getCategoryNameById(user.category)}
                </p>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>

      <br />
      <hr />
      <br />

      {/* Content Section */}
      <Row>
        {/* Content for Normal Users */}
        {role === "user" && (
          <>
            <Col sm={6} md={6}>
              <NavLink href="/user/complaint/create">
                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Create Complaint
                </Button>
              </NavLink>
            </Col>
            <Col sm={6} md={6}>
              <NavLink href="/user/complaints">
                <Button
                  variant="secondary"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  View Complaints
                </Button>
              </NavLink>
            </Col>
            <Col sm={6} md={6}>
              <NavLink href="/user/complaint/update">
                <Button
                  variant="warning"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Update Complaint
                </Button>
              </NavLink>
            </Col>
            <Col sm={6} md={6}>
              <NavLink href="/user/complaint/delete">
                <Button
                  variant="danger"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Delete Complaint
                </Button>
              </NavLink>
            </Col>
          </>
        )}

        {/* Content for Admin Users */}
        {role === "admin" && (
          <>
            <Col sm={4} md={6}>
              <NavLink href="/admin/complaints">
                <Button
                  variant="secondary"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  View All Complaints
                </Button>
              </NavLink>
            </Col>
            <Col sm={4} md={6}>
              <NavLink href="/admin/complaints/assign">
                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Assign Complaints
                </Button>
              </NavLink>
            </Col>
            <Col sm={4} md={6}>
              <NavLink href="/admin/users">
                <Button
                  variant="info"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Manage Users
                </Button>
              </NavLink>
            </Col>
            <Col sm={4} md={6}>
              <NavLink href="/admin/categories">
                <Button
                  variant="success"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Manage Categories
                </Button>
              </NavLink>
            </Col>
            <Col sm={4} md={6}>
              <NavLink href="/admin/patientComplaints">
                <Button
                  variant="warning"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Patient Complaints
                </Button>
              </NavLink>
            </Col>
            <Col sm={4} md={6}>
              <NavLink href="/admin/facultyComplaints">
                <Button
                  variant="dark"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Faculty Feedback
                </Button>
              </NavLink>
            </Col>
            <Col sm={4} md={6}>
              <NavLink href="/admin/faculty">
                <Button
                  variant="danger"
                  className="w-100 mb-3"
                  style={{ height: "300px" }}
                >
                  Manage Faculty
                </Button>
              </NavLink>
            </Col>
          </>
        )}

        {/* Content for Contractor Users */}
        {role === "contractor" && (
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Complaint Image</th>
                  <th>S.No</th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>User Who Assigned</th>
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
                    <td>{getUserNameById(complaint.user)}</td>
                    <td>
                      {complaint.status === "assigned" && (
                        <>
                          <Button
                            onClick={() => handleSolved(complaint._id)}
                            variant="success"
                            size="sm"
                            className="me-2"
                          >
                            Solved
                          </Button>
                          <Button
                            onClick={() => handleFailed(complaint._id)}
                            variant="danger"
                            size="sm"
                          >
                            Failed
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
