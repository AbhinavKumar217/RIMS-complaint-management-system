import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import PrivateRoute from "./utils/PrivateRoute";
import AdminRoute from "./utils/AdminRoute";
import CreateComplaint from "./pages/userPages/createComplaint/CreateComplaint";
import ViewComplaints from "./pages/userPages/viewComplaints/ViewComplaints";
import UpdateComplaint from "./pages/userPages/updateComplaint/UpdateComplaint";
import UpdateComplaintSingle from "./pages/userPages/updateComplaint/UpdateComplaintSingle";
import DeleteComplaint from "./pages/userPages/deleteComplaint/DeleteComplaint";
import UserSettings from "./pages/userSettings/UserSettings";
import ViewAllComplaints from "./pages/adminPages/viewAllComplaints/ViewAllComplaints";
import AssignComplaint from "./pages/adminPages/assignComplaints/AssignComplaint";
import ManageUsers from "./pages/adminPages/manageUsers/ManageUsers";
import ManageCategories from "./pages/adminPages/manageCategories/ManageCategories";
function App() {
  return (
    <div className="app-background">
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/complaint/create"
            element={
              <PrivateRoute>
                <CreateComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/complaints"
            element={
              <PrivateRoute>
                <ViewComplaints />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/complaint/update"
            element={
              <PrivateRoute>
                <UpdateComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/complaint/updateSingle/:complaintId"
            element={
              <PrivateRoute>
                <UpdateComplaintSingle />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/complaint/delete"
            element={
              <PrivateRoute>
                <DeleteComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/userSettings"
            element={
              <PrivateRoute>
                <UserSettings />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <AdminRoute>
                <ViewAllComplaints />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/complaints/assign"
            element={
              <AdminRoute>
                <AssignComplaint />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <ManageCategories />
              </AdminRoute>
            }
          />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/verify-email" Component={VerifyEmail} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
