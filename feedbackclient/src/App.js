import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NavbarComponent from "./components/navbar/Navbar";
import PatientComplaint from "./pages/patientComplaint/PatientComplaint";
import FacultyComplaint from "./pages/facultyComplaint/FacultyComplaint";
import FacultySettings from "./pages/facultySettings/FacultySettings";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <div className="app-background">
      <BrowserRouter>
      <NavbarComponent />
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/patientComplaint" Component={PatientComplaint} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <FacultyComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/facultySettings"
            element={
              <PrivateRoute>
                <FacultySettings />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
