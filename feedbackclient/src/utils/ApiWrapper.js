import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:5000"; // Replace with your API URL
console.log(baseURL);
// Create an instance of axios with the base URL
const apiWithoutAuth = axios.create({
  baseURL,
});

// Create another instance of axios for authenticated requests
const apiWithAuth = axios.create({
  baseURL,
});

// Add an interceptor to apiWithAuth instance to include the token from cookies
apiWithAuth.interceptors.request.use((config) => {
  const token = Cookies.get('facultyToken'); // Retrieve token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Export the API instances
export { apiWithoutAuth, apiWithAuth };