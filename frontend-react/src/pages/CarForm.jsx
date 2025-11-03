import React, { useState, useCallback } from 'react';
import "./../App.css";
import '../css/CarForm.css'; 

const CarForm = ({ isModal = false, onClose }) => {
  const [carData, setCarData] = useState({
    carName: '',
    model: '',
    description: '',
    stock: '',
    image: null,
  });


  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {

      setCarData(prev => ({ ...prev, image: files[0] }));
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCarData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Car Data:', carData);
    // Add API call logic here (e.g., axios.post('/api/cars', carData))
    if (onClose) onClose(); 
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="car-form-content">
      
      <div 
        className={`drag-drop-area ${carData.image ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('imageUpload').click()}
      >
        <input 
          id="imageUpload" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          hidden 
        />
        {carData.image ? (
          <p>{carData.image.name} ready to upload.</p>
        ) : (
          <>
            <p>Drag and Drop the Car Image here, or click to browse.</p>
            <small>JPG, PNG, GIF up to 5MB</small>
          </>
        )}
      </div>

      <input type="text" name="carName" placeholder="Car Name (e.g., Model S)" value={carData.carName} onChange={handleChange} required />
      <input type="text" name="model" placeholder="Model Year (e.g., 2024)" value={carData.model} onChange={handleChange} required />
      <input type="number" name="stock" placeholder="Stock # (e.g., 007)" value={carData.stock} onChange={handleChange} required />
      
      <textarea name="description" placeholder="Car Description..." value={carData.description} onChange={handleChange} rows="4" required />
      
      <button type="submit" className="submit-button">Add Car to Inventory</button>
    </form>
  );

  // If in Modal view (Desktop), wrap the form content in a modal structure
  if (isModal) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="car-form-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          <h3>Add New Car Listing</h3>
          {formContent}
        </div>
      </div>
    );
  }


  return (
    <div className="car-form-page">
      <h1>Add New Car Listing</h1>
      {formContent}
    </div>
  );
};

export default CarForm;