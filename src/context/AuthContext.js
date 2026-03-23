import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // ERROR 1 FIX: Axios ko import kiya

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ERROR 2: Loading state yahan hai

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // withCredentials zaroori hai cookies/session ke liye
        const res = await axios.get('http://localhost:5000/auth/login/success', { 
          withCredentials: true 
        });
        
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("User not logged in or session expired");
      } finally {
        setLoading(false); // Success ho ya error, loading band karni hai
      }
    };
    fetchUser();
  }, []);

  // Provider mein user, setUser aur loading teeno pass kar rahe hain
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};