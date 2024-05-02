import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiWithAuth } from "../../utils/ApiWrapper";
import Cookies from "js-cookie";

function NavbarComponent() {
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user") || "null");
  const role = JSON.parse(Cookies.get("role") || "null");

  console.log(role);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await apiWithAuth.post("/api/auth/logout");

      // Remove cookies and navigate to login
      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("role");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        {/* Left side of the navbar */}
        <Navbar.Brand href="/">RIMS CMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link href="https://rimsranchi.ac.in/">About</Nav.Link>
            <Nav.Link href="https://rimsranchi.ac.in/contact.php">Contact</Nav.Link>
            {role === "admin" && (
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="admin-dropdown">
                  Admin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/admin/users">User Info Panel</Dropdown.Item>
                  <Dropdown.Item href="/admin/complaints">Complaints Info Panel</Dropdown.Item>
                  <Dropdown.Item href="/admin/categories">Category Info Panel</Dropdown.Item>
                  {/* Add more admin menu items here as needed */}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>

          {/* Right side of the navbar */}
          <Nav className="align-items-center">
            {user ? (
              // If user is logged in, show user profile image and logout button
              <>
                <Nav.Link href="/userSettings">
                <Image
                  src={user.userImageUrl}
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
