import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './sellerDetail.css';

const SellerDetail = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestedProduct: ''
  });

  // Fetch seller details
  const fetchSeller = async () => {
    try {
      const response = await axios.get(`/api/sellers/${sellerId}`);
      setSeller(response.data.data);
    } catch (error) {
      alert('Error fetching seller: ' + error.message);
    }
  };

  // Fetch buyers for this specific seller
  const fetchSellerBuyers = async () => {
    try {
      const response = await axios.get(`/api/buyers/seller/${sellerId}`);
      setBuyers(response.data.data);
    } catch (error) {
      alert('Error fetching buyers: ' + error.message);
    }
  };

  useEffect(() => {
    fetchSeller();
    fetchSellerBuyers();
  }, [sellerId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new buyer for this specific seller
  const handleAddBuyer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/buyers', {
        ...formData,
        buyer: sellerId // Assign to this specific seller
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        requestedProduct: ''
      });
      setShowForm(false);
      fetchSellerBuyers();
      alert('Buyer request added successfully!');
    } catch (error) {
      alert('Error adding buyer: ' + error.message);
    }
  };

  if (!seller) {
    return <div className="loading">Loading seller details...</div>;
  }

  return (
    <div className="seller-detail">
      {/* Header with Back Button */}
      <div className="detail-header">
        <Link to="/" className="back-button">
          ← Back to All Sellers
        </Link>
        <h1>Seller Details</h1>
      </div>

      {/* Seller Information */}
      <div className="seller-info-card">
        <h2>{seller.fullname || seller.name}</h2>
        <div className="seller-details">
          <p><strong>Account:</strong> {seller.rate || 'N/A'}</p>
          <p><strong>Samiga:</strong> {seller.samiga || 'N/A'}</p>
          <p><strong>Value:</strong> ${seller.value || 'N/A'}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge ${seller.status || 'pending'}`}>
              {seller.status || 'Pending'}
            </span>
          </p>
        </div>
      </div>

      {/* Buyer Requests Section */}
      <div className="buyer-requests-section">
        <div className="section-header">
          <h2>Buyer Requests for This Seller ({buyers.length})</h2>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add New Request
          </button>
        </div>

        {/* Add Buyer Form */}
        {showForm && (
          <div className="add-buyer-form">
            <h3>Add New Buyer Request</h3>
            <form onSubmit={handleAddBuyer}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Requested Product:</label>
                  <input
                    type="text"
                    name="requestedProduct"
                    value={formData.requestedProduct}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  Add Request
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Buyers List */}
        {buyers.length === 0 ? (
          <div className="no-buyers">
            <p>No buyer requests found for this seller.</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Request
            </button>
          </div>
        ) : (
          <div className="buyers-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Requested Product</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer._id}>
                    <td>{buyer.name}</td>
                    <td>{buyer.email || 'N/A'}</td>
                    <td>{buyer.phone || 'N/A'}</td>
                    <td>{buyer.requestedProduct || 'N/A'}</td>
                    <td>{new Date(buyer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDetail;