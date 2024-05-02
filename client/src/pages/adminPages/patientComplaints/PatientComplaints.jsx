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
import { apiWithAuth, apiWithoutAuth } from "../../../utils/ApiWrapper";
import * as XLSX from "xlsx";

function PatientComplaints() {
  const [patientComplaints, setPatientComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const navigate = useNavigate();

  // Fetch complaints by user from the API
  useEffect(() => {
    const fetchPatientComplaints = async () => {
      try {
        // Call the API to get the complaints for the user
        const response = await apiWithAuth.get(
          `/api/feedback/patientComplaints/`
        );

        // Set the complaints in the state
        setPatientComplaints(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch patient complaints:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/feedback/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    const fetchFaculty = async () => {
      try {
        const response = await apiWithoutAuth.get("/api/feedback/faculty/");
        setFaculty(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
      }
    };

    fetchPatientComplaints();
    fetchDepartments();
    fetchFaculty();
  }, []);

  const getDepartmentNameById = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : "Unknown";
  };

  const handleDownload = () => {
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(patientComplaints.map((complaint, index) => ({
      "S.No": index + 1,
      "Name": complaint.name,
      "Age": complaint.age,
      "Sex": complaint.sex,
      "Address": complaint.address,
      "Department": getDepartmentNameById(complaint.category),
      "Unit Name": complaint.unitName,
      "Ward Name": complaint.wardName,
      "Complaint": complaint.complaint,
    })));

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Complaints");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "Patient_Complaints.xlsx");
  };

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
      <h2 className="mb-4">Patient Complaints</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Address</th>
            <th>Department</th>
            <th>Unit Name</th>
            <th>Ward Name</th>
            <th>Complaint</th>
          </tr>
        </thead>
        <tbody>
          {patientComplaints.map((patientComplaint, index) => (
            <tr key={patientComplaint._id}>
              <td>{index + 1}</td>
              <td>{patientComplaint.name}</td>
              <td>{patientComplaint.age}</td>
              <td>{patientComplaint.sex}</td>
              <td>{patientComplaint.address}</td>
              <td>{getDepartmentNameById(patientComplaint.category)}</td>
              <td>{patientComplaint.unitName}</td>
              <td>{patientComplaint.wardName}</td>
              <td>{patientComplaint.complaint}</td>
            </tr>
          ))}
        </tbody>
        <div style={{ backgroundColor: "grey", margin:"10px", padding:"10px", borderRadius:"10px" }}>
          <Button variant="primary" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </Table>
    </Container>
  );
}

export default PatientComplaints;
