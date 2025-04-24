// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8081/api";

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Service functions
const authService = {
  // Register a new user
  register: async (username, email, password) => {
    try {
      const response = await apiClient.post("/users", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Registration failed" };
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const response = await apiClient.post("/users/auth", {
        username,
        password,
      });

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Authentication failed" };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const user = localStorage.getItem("user");
    return !!user;
  },
};

export default authService;
