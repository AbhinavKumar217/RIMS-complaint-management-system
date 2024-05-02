import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  const userInfo = Cookies.get("user");
  let user = null;
  if(userInfo) {
    user = JSON.parse(userInfo);
  }
  const token = Cookies.get("token");

  console.log(user);
  console.log(token);

  // Check if the user is authenticated and has a valid token
  return user && token ? children : <Navigate to="/login" />;

};

export default PrivateRoute;
