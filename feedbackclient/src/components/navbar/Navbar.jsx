import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiWithAuth } from "../../utils/ApiWrapper";
import Cookies from "js-cookie";

function NavbarComponent() {
  const navigate = useNavigate();
  const faculty = JSON.parse(Cookies.get("faculty") || "null");

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await apiWithAuth.post("/api/feedback/auth/logout");

      // Remove cookies and navigate to login
      Cookies.remove("faculty");
      Cookies.remove("facultyToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        {/* Left side of the navbar */}
        <Navbar.Brand href="/">RIMS FS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link href="https://rimsranchi.ac.in/">About</Nav.Link>
            <Nav.Link href="https://rimsranchi.ac.in/contact.php">Contact</Nav.Link>
            <Nav.Link href="/patientComplaint">Patient Complaint</Nav.Link>
            <Nav.Link href="/">Faculty Complaint</Nav.Link>
            <Nav.Link href="">RMS</Nav.Link>
          </Nav>

          {/* Right side of the navbar */}
          <Nav className="align-items-center">
            {faculty ? (
              // If user is logged in, show user profile image and logout button
              <>
                <Nav.Link href="/facultySettings">
                <Image
                  src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
                  roundedCircle
                  height={30}
                  width={30}
                  alt="User Profile"
                  className="ms-2"
                />
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="ms-2">
                  Logout
                </Nav.Link>
              </>
            ) : (
              // If user is not logged in, show login and sign-up buttons
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
