import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';

const API_BASE_URL = "https://railbook-3mys.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // 1. URL se token check karo (Google redirect ke baad)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("rail_token", tokenFromUrl);
        // URL saaf karo taaki token upar na dikhe
        window.history.replaceState({}, document.title, "/");
      }

      // 2. LocalStorage se token uthao
      const savedToken = localStorage.getItem("rail_token");

      if (savedToken) {
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/login/success`, {
            headers: { Authorization: `Bearer ${savedToken}` } // 🔥 HEADERS MEIN BHEJO
          });
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.log("Session expired or invalid token");
          localStorage.removeItem("rail_token");
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const loginWithGoogle = () => {
    window.open(`${API_BASE_URL}/auth/google`, "_self");
  };

  const handleLogout = () => {
    localStorage.removeItem("rail_token"); // Token delete karo
    setUser(null);
    window.location.href = "/";
  };

  if (loading) return <div className="loader-container">Connecting to RailBook...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} handleLogout={handleLogout} apiBaseUrl={API_BASE_URL} /> : (
          <div className="auth-page-root">
            <button className="google-premium-btn" onClick={loginWithGoogle}>
              Continue with Google
            </button>
          </div>
        )} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;