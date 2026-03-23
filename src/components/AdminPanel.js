import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Admin.css'; 

// 🚀 Tera Live Backend URL (Render)
const API_BASE_URL = "https://railbook-3mys.onrender.com";

const AdminPanel = () => {
  const [trains, setTrains] = useState([]);
  const [formData, setFormData] = useState({
    trainNumber: '', 
    trainName: '', 
    source: '', 
    destination: '', 
    departureTime: '', 
    arrivalTime: '', 
    price: ''
  });

  // 1. Live Trains Fetch Karo
  const fetchTrains = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-trains`, {
        withCredentials: true // Session validation ke liye zaroori hai
      });
      setTrains(res.data);
    } catch (err) {
      console.error("Error fetching trains:", err);
    }
  };

  useEffect(() => { 
    fetchTrains(); 
  }, []);

  // 2. Add Train to Render Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/admin/add-train`, formData, {
        withCredentials: true
      });
      alert("✅ Train Added Successfully!");
      
      // Form Reset karo
      setFormData({ 
        trainNumber: '', trainName: '', source: '', 
        destination: '', departureTime: '', arrivalTime: '', price: '' 
      });
      
      fetchTrains(); // Table refresh karo
    } catch (err) {
      console.error("Error adding train:", err);
      alert("❌ Error adding train. Check console.");
    }
  };

  // 3. Delete Train from Render
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this train?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/delete-train/${id}`, {
          withCredentials: true
        });
        fetchTrains();
      } catch (err) {
        console.error("Error deleting train:", err);
        alert("❌ Error deleting train.");
      }
    }
  };

  return (
    <div className="admin-container">
      <h2 className="neon-text">ADMIN CONTROL PANEL 🛠️</h2>
      
      {/* ADD TRAIN FORM */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            placeholder="Train Number" 
            value={formData.trainNumber}
            onChange={e => setFormData({...formData, trainNumber: e.target.value})} 
            required 
          />
          <input 
            placeholder="Train Name" 
            value={formData.trainName}
            onChange={e => setFormData({...formData, trainName: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            placeholder="From (Source)" 
            value={formData.source}
            onChange={e => setFormData({...formData, source: e.target.value})} 
            required 
          />
          <input 
            placeholder="To (Destination)" 
            value={formData.destination}
            onChange={e => setFormData({...formData, destination: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="time" 
            value={formData.departureTime}
            onChange={e => setFormData({...formData, departureTime: e.target.value})} 
            required 
          />
          <input 
            type="number" 
            placeholder="Price (₹)" 
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})} 
            required 
          />
        </div>
        <button type="submit" className="add-btn">ADD TRAIN TO SYSTEM</button>
      </form>

      {/* TRAINS TABLE */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Route</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trains.length > 0 ? (
              trains.map(train => (
                <tr key={train._id}>
                  <td>{train.trainNumber}</td>
                  <td>{train.trainName}</td>
                  <td>{train.source} ➔ {train.destination}</td>
                  <td>₹{train.price}</td>
                  <td>
                    <button onClick={() => handleDelete(train._id)} className="del-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No trains found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;