import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

// 🚀 apiBaseUrl prop yahan receive ho raha hai
const Dashboard = ({ user, handleLogout, isAdminView, setIsAdminView, apiBaseUrl }) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('search');
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [passenger, setPassenger] = useState({ name: '', age: '', journeyDate: '' });
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });

  const ADMIN_USERNAME = "faraz_admin";
  const ADMIN_PASSWORD = "password123";

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminCreds.username === ADMIN_USERNAME && adminCreds.password === ADMIN_PASSWORD) {
      setShowAdminAuthModal(false);
      navigate('/admin/dashboard');
    } else {
      alert("Invalid Admin Credentials! ❌");
    }
  };

  const fetchAllTrains = useCallback(async () => {
    setLoading(true);
    try {
      // 🚀 Render URL use kiya
      const res = await axios.get(`${apiBaseUrl}/api/admin/all-trains`);
      setTrains(res.data);
      setFilteredTrains(res.data); 
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [apiBaseUrl]);

  useEffect(() => { fetchAllTrains(); }, [fetchAllTrains]);

  const handleSearch = () => {
    setView('search');
    const results = trains.filter(t =>
      t.source.toLowerCase().includes(from.toLowerCase()) &&
      t.destination.toLowerCase().includes(to.toLowerCase())
    );
    setFilteredTrains(results);
  };

  const fetchMyBookings = async () => {
    setView('myBookings');
    setLoading(true);
    try {
      // 🚀 Render URL use kiya
      const res = await axios.get(`${apiBaseUrl}/api/booking/my-bookings/${user?._id}`);
      setUserBookings(res.data.bookings || []);
    } catch (err) { setUserBookings([]); }
    finally { setLoading(false); }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if(!passenger.journeyDate) return alert("Please select a date!");

    try {
      // 🚀 Render URL use kiya
      const res = await axios.post(`${apiBaseUrl}/api/booking/book-ticket`, {
        trainId: selectedTrain._id,
        userId: user?._id,
        passengerName: passenger.name,
        passengerAge: passenger.age,
        userEmail: user?.email,
        journeyDate: passenger.journeyDate
      });
      if (res.data.success) {
        alert("Booking Confirmed! Check Email. 🎫");
        setShowBookingModal(false);
        setPassenger({ name: '', age: '', journeyDate: '' });
        fetchMyBookings();
      }
    } catch (err) { alert("Booking failed!"); }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure?")) {
      try {
        // 🚀 Render URL use kiya
        await axios.delete(`${apiBaseUrl}/api/booking/cancel/${bookingId}`);
        setShowDetailsModal(false);
        fetchMyBookings();
      } catch (err) { alert("Error cancelling"); }
    }
  };

  return (
    <div className="rb-dashboard-root">
      {/* ... Baki HTML code waisa hi rahega ... */}
    </div>
  );
};

export default Dashboard;