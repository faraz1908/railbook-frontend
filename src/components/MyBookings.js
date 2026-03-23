import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🚀 Tera Live Backend URL (Render)
const API_BASE_URL = "https://railbook-3mys.onrender.com";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Live Bookings Fetch Karo
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/booking/user`, { 
        withCredentials: true 
      });
      
      // API response handle karne ka foolproof tarika
      const data = res.data.bookings || res.data; 
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Ticket Cancel Logic (Live Server)
  const handleCancel = async (id) => {
    if (window.confirm("Bhai, pakka cancel karu ticket?")) {
      try {
        const res = await axios.put(`${API_BASE_URL}/api/booking/cancel-ticket/${id}`, {}, { 
          withCredentials: true 
        });
        
        if (res.data.success) {
          alert("✅ Ticket Cancel successfully.");
          fetchBookings(); // List refresh karo
        }
      } catch (err) {
        alert("❌ Error: " + (err.response?.data?.message || "Check Route"));
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your journeys...</div>;

  return (
    <div className="bookings-container" style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '25px', fontFamily: 'sans-serif' }}>My Journey History 🚆</h2>
      
      <div className="bookings-list">
        {bookings.length > 0 ? bookings.map((b) => {
          const currentStatus = b.status ? b.status.toLowerCase() : 'confirmed';
          const isCancelled = currentStatus === 'cancelled';

          return (
            <div key={b._id} className="booking-card" style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <div className="card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>
                    {b.trainId?.trainName || b.trainName || "Express Train"}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backgroundColor: isCancelled ? '#fee2e2' : '#dcfce7',
                    color: isCancelled ? '#ef4444' : '#10b981'
                  }}>
                    {b.status || 'Confirmed'}
                  </span>
                </div>
                <p style={{ color: '#64748b', marginTop: '8px', fontSize: '0.95rem' }}>
                  {b.trainId?.source || b.from || 'Source'} ➔ {b.trainId?.destination || b.to || 'Destination'} | 
                  <b style={{ color: '#334155' }}> Passenger: {b.passengerName}</b>
                </p>
              </div>

              <div className="card-right" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: '800', fontSize: '1.1rem' }}>Seat: {b.seatNumber}</span>
                
                <button style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0072ff',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}>View Details</button>

                {!isCancelled && (
                  <button 
                    onClick={() => handleCancel(b._id)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1px solid #ef4444',
                      backgroundColor: '#fff',
                      color: '#ef4444',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        }) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            background: '#f8fafc', 
            borderRadius: '20px', 
            color: '#94a3b8',
            border: '2px dashed #e2e8f0' 
          }}>
            <h3 style={{ margin: 0 }}>Bhai, koi booking nahi mili!</h3>
            <p>Go to Dashboard and book your first train.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;