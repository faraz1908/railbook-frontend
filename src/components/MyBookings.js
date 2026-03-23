import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/booking/user", { withCredentials: true });
      // API response handle karne ka foolproof tarika
      const data = res.data.bookings || res.data; 
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bhai, pakka cancel karu ticket?")) {
      try {
        // Backend route check: cancel-ticket vs cancel
        const res = await axios.put(`http://localhost:5000/api/booking/cancel-ticket/${id}`, {}, { withCredentials: true });
        if (res.data.success) {
          alert("Ticket Cancel Ho Gayi! Seat wapas badh gayi.");
          fetchBookings(); 
        }
      } catch (err) {
        alert("Backend error: " + (err.response?.data?.message || "Check Route"));
      }
    }
  };

  return (
    <div className="bookings-container" style={{ padding: '30px' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>My Journey History</h2>
      
      <div className="bookings-list">
        {bookings.length > 0 ? bookings.map((b) => {
          // Status check logic: case insensitive
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
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <div className="card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0 }}>{b.trainId?.trainName || b.trainName || "Express Train"}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: isCancelled ? '#fee2e2' : '#dcfce7',
                    color: isCancelled ? '#ef4444' : '#10b981'
                  }}>
                    {b.status || 'Confirmed'}
                  </span>
                </div>
                <p style={{ color: '#64748b', marginTop: '8px' }}>
                  {b.trainId?.source || b.from || 'Udaipur'} ➔ {b.trainId?.destination || b.to || 'Asarva'} | 
                  <b> Passenger: {b.passengerName}</b>
                </p>
              </div>

              <div className="card-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: '800' }}>Seat: {b.seatNumber}</span>
                
                <button style={{
                  padding: '8px 15px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0072ff',
                  color: 'white',
                  cursor: 'pointer'
                }}>View Details</button>

                {/* FORCE SHOW BUTTON: Agar ticket cancelled nahi hai toh button dikhega hi dikhega */}
                {!isCancelled && (
                  <button 
                    onClick={() => handleCancel(b._id)}
                    style={{
                      padding: '8px 15px',
                      borderRadius: '8px',
                      border: '1px solid #ef4444',
                      backgroundColor: '#fff5f5',
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
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>Bhai, koi booking nahi mili!</div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;