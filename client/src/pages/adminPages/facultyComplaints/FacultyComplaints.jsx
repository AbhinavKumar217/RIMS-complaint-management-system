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

function FacultyComplaints() {
  const [facultyComplaints, setFacultyComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultys, setFacultys] = useState([]);

  const navigate = useNavigate();

  // Fetch complaints by user from the API
  useEffect(() => {
    const fetchFacultyComplaints = async () => {
      try {
        // Call the API to get the complaints for the user
        const response = await apiWithAuth.get(
          `/api/feedback/facultyComplaints/`
        );

        // Set the complaints in the state
        setFacultyComplaints(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch faculty complaints:", error);
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
        setFacultys(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
      }
    };

    fetchFacultyComplaints();
    fetchDepartments();
    fetchFaculty();
  }, []);

  const getDepartmentNameById = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : "Unknown";
  };

  const getFacultyNameById = (facultyId) => {
    const faculty = facultys.find((fac) => fac._id === facultyId);
    console.log(facultyId);
    console.log(faculty);
    return faculty ? faculty.username : "N/A";
  };

  const handleDownload = () => {
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(facultyComplaints.map((complaint, index) => ({
      "S.No": index + 1,
      "Faculty": getFacultyNameById(complaint.faculty),
      "Department": getDepartmentNameById(complaint.department),
      "Unit Name": complaint.unitName,
      "Complaint": complaint.complaint,
    })));

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty Complaints");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "Faculty_Complaints.xlsx");
  };

  return (
    <Container style={{ width: "60%", minHeight: "91vh" }}>
      <h2 className="mb-4">Patient Complaints</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Faculty</th>
            <th>Department</th>
            <th>Unit Name</th>
            <th>Complaint</th>
          </tr>
        </thead>
        <tbody>
          {facultyComplaints.map((facultyComplaint, index) => (
            <tr key={facultyComplaint._id}>
              <td>{index + 1}</td>
              <td>{getFacultyNameById(facultyComplaint.faculty)}</td>
              <td>{getDepartmentNameById(facultyComplaint.department)}</td>
              <td>{facultyComplaint.unitName}</td>
              <td>{facultyComplaint.complaint}</td>
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

export default FacultyComplaints;
