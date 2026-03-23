import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard'; 
import './App.css'; 

// 🚀 Tera Live Backend URL (Render)
const API_BASE_URL = "https://railbook-3mys.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Naye Render URL se check kar rahe hain
        const res = await axios.get(`${API_BASE_URL}/auth/login/success`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const loginWithGoogle = () => {
    // Google Auth redirect link update
    window.open(`${API_BASE_URL}/auth/google`, "_self");
  };

  const handleLogout = () => {
    // Logout redirect link update
    window.open(`${API_BASE_URL}/auth/logout`, "_self");
    setUser(null);
  };

  if (loading) return (
    <div className="loader-container">
      Connecting to Rail<span>Book</span>...
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Dashboard 
                  user={user} 
                  handleLogout={handleLogout} 
                  isAdminView={isAdminView} 
                  setIsAdminView={setIsAdminView} 
                  apiBaseUrl={API_BASE_URL} // Props mein bhi pass kar diya backup ke liye
                />
              ) : (
                <div className="auth-page-root">
                  <div className="auth-glass-container">
                    <h1 className="neon-title">Rail<span>Book</span></h1>
                    <p className="tagline">India's Premium Train Booking App</p>
                    <button className="google-premium-btn" onClick={loginWithGoogle}>
                      <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="G" />
                      <span>Continue with Google</span>
                    </button>
                    <div className="secure-footer">
                      <span className="icon">🔒</span> Secure SSL Encrypted Connection
                    </div>
                  </div>
                </div>
              )
            } 
          />
          {/* Admin Dashboard ko bhi Base URL de diya */}
          <Route path="/admin/dashboard" element={<AdminDashboard apiBaseUrl={API_BASE_URL} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;