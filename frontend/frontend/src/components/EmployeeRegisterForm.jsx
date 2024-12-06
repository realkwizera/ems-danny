import React, { useState } from 'react';
import api from '../services/api';

const EmployeeRegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    cv: null, // Initially set to null to store file
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cv") {
      setFormData((prevState) => ({ ...prevState, cv: e.target.files[0] })); // Handle file input
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Validation function
  const validateForm = () => {
    const validationErrors = {};
    if (!formData.firstName) validationErrors.firstName = 'First name is required';
    if (!formData.lastName) validationErrors.lastName = 'Last name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.phone) validationErrors.phone = 'Phone number is required';
    if (!formData.dob) validationErrors.dob = 'Date of birth is required';
    if (!formData.cv) validationErrors.cv = 'CV is required'; // Check for file input
    return validationErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const form = new FormData(); // Create a new FormData object
    form.append('firstName', formData.firstName);
    form.append('lastName', formData.lastName);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('dob', formData.dob);
    form.append('cv', formData.cv); // Append the file input

    try {
      const response = await api.post('/employee/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Set content type for file upload
      });

      if (response.status === 201) {
        alert(response.data.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dob: '',
          cv: null, // Reset file input
        });
        setErrors({});
      }
    } catch (error) {
      console.log(error.response?.data?.error || 'Error registering employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f3f4f6' }}>
      <div
        className="p-5 rounded shadow-lg"
        style={{
          backgroundColor: '#ffffff',
          borderLeft: '5px solid #198754', // Success green for border
        }}
      >
        <h3 className="text-success">Employee Registration Form</h3>
        <p className="text-muted">
          Fill out the form below to register a new employee.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <div className="text-danger">{errors.dob}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="cv" className="form-label">CV (File)</label>
            <input
              type="file"
              className="form-control"
              id="cv"
              name="cv"
              onChange={handleChange}
            />
            {errors.cv && <div className="text-danger">{errors.cv}</div>}
          </div>

          <button type="submit" className="btn btn-success" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegisterForm;
