import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  const facultyInfo = Cookies.get("faculty");
  let faculty = null;
  if(facultyInfo) {
    faculty = JSON.parse(facultyInfo);
  }
  const token = Cookies.get("facultyToken");

  console.log(faculty);
  console.log(token);

  // Check if the user is authenticated and has a valid token
  return faculty && token ? children : <Navigate to="/login" />;

};

export default PrivateRoute;
