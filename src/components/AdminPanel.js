import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Admin.css'; // 

const AdminPanel = () => {
  const [trains, setTrains] = useState([]);
  const [formData, setFormData] = useState({
    trainNumber: '', trainName: '', source: '', destination: '', departureTime: '', arrivalTime: '', price: ''
  });

  // Trains Fetch Karo
  const fetchTrains = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/all-trains');
    setTrains(res.data);
  };

  useEffect(() => { fetchTrains(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/admin/add-train', formData);
    alert("Train Added!");
    fetchTrains(); // Table refresh karo
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this train?")) {
      await axios.delete(`http://localhost:5000/api/admin/delete-train/${id}`);
      fetchTrains();
    }
  };

  return (
    <div className="admin-container">
      <h2 className="neon-text">ADMIN CONTROL PANEL 🛠️</h2>
      
      {/* ADD TRAIN FORM */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input placeholder="Train Number" onChange={e => setFormData({...formData, trainNumber: e.target.value})} required />
        <input placeholder="Train Name" onChange={e => setFormData({...formData, trainName: e.target.value})} required />
        <input placeholder="From" onChange={e => setFormData({...formData, source: e.target.value})} required />
        <input placeholder="To" onChange={e => setFormData({...formData, destination: e.target.value})} required />
        <input type="time" onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
        <input type="number" placeholder="Price" onChange={e => setFormData({...formData, price: e.target.value})} required />
        <button type="submit" className="add-btn">ADD TRAIN</button>
      </form>

      {/* TRAINS TABLE */}
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
          {trains.map(train => (
            <tr key={train._id}>
              <td>{train.trainNumber}</td>
              <td>{train.trainName}</td>
              <td>{train.source} ➔ {train.destination}</td>
              <td>₹{train.price}</td>
              <td><button onClick={() => handleDelete(train._id)} className="del-btn">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;