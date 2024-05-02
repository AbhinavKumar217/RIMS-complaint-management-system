import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiWithAuth } from "../../../utils/ApiWrapper";
import Cookies from "js-cookie";

function UpdateComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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

  // Handle the update button click
  const handleUpdateClick = (complaintId) => {
    navigate(`/user/complaint/updateSingle/${complaintId}`);
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
                {/* Update button */}
                <Button
                  variant="primary"
                  onClick={() => handleUpdateClick(complaint._id)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UpdateComplaint;
