import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; 

export const AuthContext = createContext();

// 🚀 Tera Live Backend URL
const API_BASE_URL = "https://railbook-3mys.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Direct axios call, no dependency on ./api
        const res = await axios.get(`${API_BASE_URL}/auth/login/success`, { 
          withCredentials: true 
        });
        
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("User not logged in or session expired");
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};