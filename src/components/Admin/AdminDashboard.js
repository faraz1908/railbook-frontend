import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Train, Ticket, IndianRupee, PlusCircle, Trash2, Edit, Users, LogOut, LayoutDashboard } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ apiBaseUrl }) => { // 🚀 Props se URL liya
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalTrains: 0, totalBookings: 0, totalIncome: 0, graphData: [] });
  const [trains, setTrains] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({ 
    trainName: '', trainNumber: '', source: '', destination: '', departureTime: '', price: '' 
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    fetchStats();
    fetchTrains();
    fetchUsers();
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/admin/stats`);
      setStats(res.data);
    } catch (err) { console.error("Stats fetch error"); }
  };

  const fetchTrains = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/admin/all-trains`);
      setTrains(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Trains fetch error"); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/admin/users`);
      setAllUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Users fetch error"); }
  };

  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBaseUrl}/api/admin/add-train`, formData);
      if(res.data.success) {
        alert("🎉 Train Added Successfully!");
        setFormData({ trainName: '', trainNumber: '', source: '', destination: '', departureTime: '', price: '' });
        fetchAllData(); 
        setActiveTab('manage'); 
      }
    } catch (err) { alert("Error: Could not save train!"); }
  };

  const deleteTrain = async (id) => {
    if(window.confirm("Sure delete?")) {
      try {
        await axios.delete(`${apiBaseUrl}/api/admin/trains/${id}`);
        fetchAllData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="admin-layout">
      {/* ... Baki Sidebar aur UI code waisa hi rahega ... */}
    </div>
  );
};

export default AdminDashboard;