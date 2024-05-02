import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminRoute = ({ children }) => {
  const userInfo = Cookies.get("user");
  const roleString = Cookies.get("role");
  let user = null;
  let role = null;
  if(userInfo) {
    user = JSON.parse(userInfo);
  }
  if(roleString) {
    role = JSON.parse(roleString);
  }
  const token = Cookies.get("token");

  console.log(user);
  console.log(token);
  console.log(role);

  // Check if the user is authenticated, has an admin role, and has a valid token
  return user && role === "admin" && token ? children : <Navigate to="/" />;
};

export default AdminRoute;
