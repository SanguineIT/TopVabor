// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const initialUser = JSON.parse(localStorage.getItem('user')) || null;
  const [user, setUser] = useState(initialUser);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
