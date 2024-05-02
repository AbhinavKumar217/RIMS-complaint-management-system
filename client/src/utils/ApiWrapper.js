import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.REACT_APP_BASE_URL; // Replace with your API URL

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
  const token = Cookies.get('token'); // Retrieve token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Export the API instances
export { apiWithoutAuth, apiWithAuth };