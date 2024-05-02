import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { apiWithAuth } from "../../../utils/ApiWrapper";

function AssignComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch all complaints and contractors
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await apiWithAuth.get("/api/complaints");
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
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

    fetchComplaints();
    fetchCategories();
    fetchUsers();
  }, []);

  // Fetch contractors by category
  const fetchContractorsByCategory = async (categoryId) => {
    try {
      const response = await apiWithAuth.get(
        `/api/users/category/${categoryId}`
      );
      console.log(response.status);
      if(response.status === 404) {
        setContractors(null);
      }
      setContractors(response.data.contractors);
    } catch (error) {
      console.error("Failed to fetch contractors by category:", error);
    }
  };

  // Handle opening the modal and fetching contractors for the selected complaint
  const handleAssignButtonClick = (complaint) => {
    setSelectedComplaint(complaint);
    fetchContractorsByCategory(complaint.category);
    setShowModal(true);
  };

  // Handle confirming the assignment of the complaint
  const handleConfirmAssignment = async () => {
    try {
      const { _id } = selectedComplaint;

      // Assign the complaint to the selected contractor
      await apiWithAuth.post(`/api/complaints/assign/${_id}`, {
        contractorId: selectedContractor,
      });

      alert("Complaint assigned successfully!");
      setShowModal(false);
      // Optionally, refresh the complaints list
      const response = await apiWithAuth.get("/api/complaints");
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to assign complaint:", error);
    }
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getContractorNameById = (contractorId) => {
    const contractor = users.find((cont) => cont._id === contractorId);
    console.log(contractorId);
    console.log(contractor);
    return contractor ? contractor.username : "Unknown";
  }

  return (
    <Container style={{ width: "80%", minHeight:"91vh" }}>
      <h2 className="mb-4">Assign Complaint</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Complaint Description</th>
            <th>Category</th>
            <th>Address</th>
            <th>Assigned Contractor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint._id}>
              <td>{index + 1}</td>
              <td>{complaint.description}</td>
              <td>{getCategoryNameById(complaint.category)}</td>
              <td>{complaint.address}</td>
              <td>
                {complaint.contractor
                  ? getContractorNameById(complaint.contractor)
                  : "Not Assigned"}
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleAssignButtonClick(complaint)}
                >
                  Assign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for assigning complaint */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formContractor" className="mb-3">
              <Form.Label>Select Contractor</Form.Label>
              <Form.Control
                as="select"
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
              >
                <option value="">Select Contractor</option>
                {contractors.map((contractor) => (
                  <option key={contractor._id} value={contractor._id}>
                    {contractor.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAssignment}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AssignComplaint;
