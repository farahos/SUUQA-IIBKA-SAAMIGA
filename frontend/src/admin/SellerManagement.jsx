import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './buyerManagement.css';

const SellerManagement = () => {
  const [sellers, setsellers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingseller, setEditingseller] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    rate: '',
    samiga: '',
    value: '',
    status: 'Available'
  });

  // Fetch all sellers
  const fetchsellers = async () => {
    try {
      const response = await axios.get('/api/sellers');
      setsellers(response.data.data);
    } catch (error) {
      alert('Error fetching sellers: ' + error.message);
    }
  };

  useEffect(() => {
    fetchsellers();
  }, []);

  // Handle form input changes - WITH AUTO CALCULATION
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value
      };
      
      // Auto-calculate value when rate or samiga changes
      if (name === 'rate' || name === 'samiga') {
        const rate = name === 'rate' ? value : prevData.rate;
        const samiga = name === 'samiga' ? value : prevData.samiga;
        
        if (rate && samiga) {
          newData.value = (parseFloat(rate) * parseFloat(samiga)).toFixed();
        } else {
          newData.value = '';
        }
      }
      
      return newData;
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullname: '',
      rate: '',
      samiga: '',
      value: '',
      status: 'Available'
    });
    setEditingseller(null);
    setShowForm(false);
  };

  // Add new seller
  const handleAddseller = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sellers', formData);
      resetForm();
      fetchsellers();
      alert('seller added successfully!');
    } catch (error) {
      alert('Error adding seller: ' + error.message);
    }
  };

  // Update seller
  const handleUpdateseller = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/sellers/${editingseller._id}`, formData);
      resetForm();
      fetchsellers();
      alert('seller updated successfully!');
    } catch (error) {
      alert('Error updating seller: ' + error.message);
    }
  };

  // Delete seller
  const handleDeleteseller = async (id) => {
    if (window.confirm('Ma hubtaa inaad tirtid seller-gan?')) {
      try {
        await axios.delete(`/api/sellers/${id}`);
        fetchsellers();
        alert('seller deleted successfully!');
      } catch (error) {
        alert('Error deleting seller: ' + error.message);
      }
    }
  };

  // Edit seller - fill form with existing data
  const handleEditseller = (seller) => {
    setFormData({
      fullname: seller.fullname,
      rate: seller.rate,
      samiga: seller.samiga,
      value: seller.value,
      status: seller.status
    });
    setEditingseller(seller);
    setShowForm(true);
  };

  // Update status only
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/sellers/${id}/status`, { status: newStatus });
      fetchsellers();
      alert('Status updated!');
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  return (
    <div className="seller-management">
      <div className="header">
        <h1>seller Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New seller
        </button>
      </div>

      {/* Add/Edit Form Popup */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <div className="popup-header">
              <h2>{editingseller ? 'Edit seller' : 'Add New seller'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={editingseller ? handleUpdateseller : handleAddseller}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rate:</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Samiga:</label>
                <input
                  type="number"
                  name="samiga"
                  value={formData.samiga}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Value (Auto-calculated):</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  readOnly
                  className="readonly-input"
                  placeholder="Auto-calculated"
                />
                <small className="calculation-info">
                  Value = Rate × Samiga
                </small>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingseller ? 'Update seller' : 'Add seller'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* sellers List */}
      <div className="sellers-list">
        <h2>sellers List ({sellers.length})</h2>
        
        {sellers.length === 0 ? (
          <p>No sellers found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Rate</th>
                  <th>Samiga</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller._id}>
                    <td>{seller.fullname}</td>
                    <td>{seller.rate}</td>
                    <td>{seller.samiga}</td>
                    <td>${seller.value}</td>
                    <td>
                      <select
                        value={seller.status}
                        onChange={(e) => handleStatusChange(seller._id, e.target.value)}
                        className={`status-select ${seller.status}`}
                      >
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditseller(seller)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteseller(seller._id)}
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

export default SellerManagement;