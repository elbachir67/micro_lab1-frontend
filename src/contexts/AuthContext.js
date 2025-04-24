// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if there's a user in local storage when the component mounts
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.register(username, email, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.error || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(username, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.error || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
