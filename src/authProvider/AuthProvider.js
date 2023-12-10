// auth.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  // Function to retrieve user data from localStorage
  function getStoredUser() {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Function to save user data to localStorage
  function setStoredUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  }

  // Function to handle user login
  function login(user) {
    // Replace this with your actual login logic
    setUser(user);
    setStoredUser(user);
  }

  // Function to handle user logout
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/signUp";
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, getStoredUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return auth;
};

export { AuthProvider, useAuth };
