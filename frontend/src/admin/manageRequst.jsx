import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './buyerManagement.css';

const BuyerManagement = () => {
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestedProduct: ''
  });

  // Fetch all sellers for display only
  const fetchSellers = async () => {
    try {
      const response = await axios.get('/api/sellers');
      setSellers(response.data.data);
    } catch (error) {
      console.error('Error fetching sellers: ' + error.message);
    }
  };

  // Fetch all buyers
  const fetchBuyers = async () => {
    try {
      const response = await axios.get('/api/buyers');
      setBuyers(response.data.data);
    } catch (error) {
      alert('Error fetching buyers: ' + error.message);
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchBuyers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      requestedProduct: ''
    });
    setEditingBuyer(null);
    setShowForm(false);
  };

  // Add new buyer - NO seller selection
  const handleAddBuyer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/buyers', formData);
      resetForm();
      fetchBuyers();
      alert('Buyer added successfully!');
    } catch (error) {
      alert('Error adding buyer: ' + error.message);
    }
  };

  // Update buyer
  const handleUpdateBuyer = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/buyers/${editingBuyer._id}`, formData);
      resetForm();
      fetchBuyers();
      alert('Buyer updated successfully!');
    } catch (error) {
      alert('Error updating buyer: ' + error.message);
    }
  };

  // Delete buyer
  const handleDeleteBuyer = async (id) => {
    if (window.confirm('Ma hubtaa inaad tirtid buyer-gan?')) {
      try {
        await axios.delete(`/api/buyers/${id}`);
        fetchBuyers();
        alert('Buyer deleted successfully!');
      } catch (error) {
        alert('Error deleting buyer: ' + error.message);
      }
    }
  };

  // Edit buyer - fill form with existing data
  const handleEditBuyer = (buyer) => {
    setFormData({
      name: buyer.name,
      email: buyer.email || '',
      phone: buyer.phone || '',
      requestedProduct: buyer.requestedProduct || ''
    });
    setEditingBuyer(buyer);
    setShowForm(true);
  };

  // Get seller name by ID
  const getSellerName = (buyerObj) => {
    if (!buyerObj.buyer) return 'N/A';
    
    if (typeof buyerObj.buyer === 'object') {
      return buyerObj.buyer.fullname || buyerObj.buyer.name || 'N/A';
    }
    
    const seller = sellers.find(s => s._id === buyerObj.buyer);
    return seller ? seller.fullname || seller.name : 'N/A';
  };

  return (
    <div className="buyer-management">
      


      {/* Add/Edit Form Popup */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <div className="popup-header">
              <h2>{editingBuyer ? 'Edit Buyer' : 'Add New Buyer Request'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={editingBuyer ? handleUpdateBuyer : handleAddBuyer}>
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

              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingBuyer ? 'Update Buyer' : 'Add Buyer Request'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buyers List */}
      <div className="buyers-list">
        <h2>All Buyer Requests ({buyers.length})</h2>
        
        {buyers.length === 0 ? (
          <p>No buyer requests found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Assigned Seller</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Requested Product</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer._id}>
                     <td>
                      {buyer.buyer ? (
                        <Link 
                          to={`/seller/${buyer.buyer._id || buyer.buyer}`}
                          className="seller-link"
                        >
                          {getSellerName(buyer)}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{buyer.name}</td>
                    <td>{buyer.email || 'N/A'}</td>
                    <td>{buyer.phone || 'N/A'}</td>
                    <td>{buyer.requestedProduct || 'N/A'}</td>
                   
                    <td>{new Date(buyer.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditBuyer(buyer)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteBuyer(buyer._id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default BuyerManagement;

