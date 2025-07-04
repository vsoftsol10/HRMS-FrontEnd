import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Add this import
import './MyProfile.css';

const MyProfile = () => { // Accept employeeCode as prop
    const { employeeId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Employee data state
  const [employeeData, setEmployeeData] = useState({
    // Personal Information
    fullName: '',
    employeeId: '',
    profilePhoto: '/api/placeholder/150/150',
    dateOfBirth: '',
    age: 0,
    gender: '',
    maritalStatus: '',
    nationality: '',
    personalEmail: '',
    phoneNumber: '',
    alternatePhone: '',
    currentAddress: '',
    permanentAddress: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    
    // Professional Information
    jobTitle: '',
    department: '',
    employeeType: '',
    dateOfJoining: '',
    yearsOfService: 0,
    reportingManager: '',
    workLocation: '',
    employeeStatus: 'Active',
    
    // Employment Details
    currentSalary: '$0',
    workSchedule: 'Monday - Friday, 9:00 AM - 6:00 PM',
    benefits: []
  });

  // Fetch employee profile data
  // Fetch employee profile data
const fetchProfileData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(`https://vsofthrms-production.up.railway.app/api/profile/${employeeId}`); // Use employeeId from URL
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Employee profile not found');
      }
      throw new Error('Failed to fetch profile data');
    }
    
    const data = await response.json();
    setEmployeeData(data);
  } catch (err) {
    console.error('Error fetching profile data:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Save profile data to backend
  // Save profile data to backend
const saveProfileData = async (updatedData) => {
  try {
    setSaving(true);
    
    const response = await fetch(`https://vsofthrms-production.up.railway.app/api/profile/${employeeId}`, { // Use employeeId from URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save profile data');
    }
    
    // Refresh data after successful save
    await fetchProfileData();
    return true;
  } catch (err) {
    console.error('Error saving profile data:', err);
    setError(err.message);
    return false;
  } finally {
    setSaving(false);
  }
};

  // Load data on component mount
 // Load data on component mount
useEffect(() => {
  if (employeeId) { // Only fetch if employeeId exists
    fetchProfileData();
  }
}, [employeeId]); // Add employeeId as dependency

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setError(null); // Clear any existing errors
  };

  const handleSave = async () => {
    const success = await saveProfileData(employeeData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Refresh data to revert any unsaved changes
    fetchProfileData();
  };

  const handleInputChange = (field, value) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="myprofile-container">
        <div className="loading-state">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !employeeData.fullName) {
    return (
      <div className="myprofile-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchProfileData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="myprofile-container">
      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
        </div>
      )}
      
      <div className="profile-header">
        <div className="profile-photo-section">
          {/* <img 
            src={employeeData.profilePhoto} 
            alt="Profile" 
            className="profile-photo"
          /> */}
          <div className="profile-basic-info">
            <h1>{employeeData.fullName}</h1>
            <p className="employee-id" style={{color:"white", opacity:"1"}}>Employee ID: {employeeData.employeeId}</p>
            <p className="job-title">{employeeData.jobTitle}</p>
            <span className={`status-badge ${employeeData.employeeStatus.toLowerCase()}`}>
              {employeeData.employeeStatus}
            </span>
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn-edit" onClick={handleEdit}>
              <i className="icon-edit"></i>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn-save" 
                onClick={handleSave}
                disabled={saving}
              >
                <i className="icon-save"></i>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="btn-cancel" 
                onClick={handleCancel}
                disabled={saving}
              >
                <i className="icon-cancel"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-navigation">
        <button 
          className={`nav-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button 
          className={`nav-tab ${activeTab === 'professional' ? 'active' : ''}`}
          onClick={() => setActiveTab('professional')}
        >
          Professional Information
        </button>
        <button 
          className={`nav-tab ${activeTab === 'employment' ? 'active' : ''}`}
          onClick={() => setActiveTab('employment')}
        >
          Employment Details
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="tab-content">
            <div className="section-card">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={employeeData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.fullName}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={employeeData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.dateOfBirth}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <span className="form-value">{calculateAge(employeeData.dateOfBirth)} years</span>
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  {isEditing ? (
                    <select 
                      value={employeeData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span className="form-value">{employeeData.gender}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Marital Status</label>
                  {isEditing ? (
                    <select 
                      value={employeeData.maritalStatus}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  ) : (
                    <span className="form-value">{employeeData.maritalStatus}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Nationality</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={employeeData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.nationality}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Personal Email</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={employeeData.personalEmail}
                      onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.personalEmail}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={employeeData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.phoneNumber}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Alternate Phone</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={employeeData.alternatePhone}
                      onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.alternatePhone}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Address Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Current Address</label>
                  {isEditing ? (
                    <textarea 
                      value={employeeData.currentAddress}
                      onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                      rows="3"
                    />
                  ) : (
                    <span className="form-value">{employeeData.currentAddress}</span>
                  )}
                </div>
                
                <div className="form-group full-width">
                  <label>Permanent Address</label>
                  {isEditing ? (
                    <textarea 
                      value={employeeData.permanentAddress}
                      onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                      rows="3"
                    />
                  ) : (
                    <span className="form-value">{employeeData.permanentAddress}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Emergency Contact</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Contact Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={employeeData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.emergencyContactName}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Relationship</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={employeeData.emergencyContactRelation}
                      onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.emergencyContactRelation}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={employeeData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.emergencyContactPhone}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={employeeData.emergencyContactEmail}
                      onChange={(e) => handleInputChange('emergencyContactEmail', e.target.value)}
                    />
                  ) : (
                    <span className="form-value">{employeeData.emergencyContactEmail}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="tab-content">
            <div className="section-card">
              <h3>Job Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title</label>
                  <span className="form-value">{employeeData.jobTitle}</span>
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <span className="form-value">{employeeData.department}</span>
                </div>
                
                <div className="form-group">
                  <label>Employee Type</label>
                  <span className="form-value">{employeeData.employeeType}</span>
                </div>
                
                <div className="form-group">
                  <label>Date of Joining</label>
                  <span className="form-value">{employeeData.dateOfJoining}</span>
                </div>
                
                <div className="form-group">
                  <label>Years of Service</label>
                  <span className="form-value">{employeeData.yearsOfService} years</span>
                </div>
                
                <div className="form-group">
                  <label>Reporting Manager</label>
                  <span className="form-value">{employeeData.reportingManager}</span>
                </div>
                
                <div className="form-group">
                  <label>Work Location</label>
                  <span className="form-value">{employeeData.workLocation}</span>
                </div>
                
                <div className="form-group">
                  <label>Employee Status</label>
                  <span className={`form-value status-badge ${employeeData.employeeStatus.toLowerCase()}`}>
                    {employeeData.employeeStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employment' && (
          <div className="tab-content">
            <div className="section-card">
              <h3>Compensation & Benefits</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Salary</label>
                  <span className="form-value">{employeeData.currentSalary}</span>
                </div>
                
                <div className="form-group">
                  <label>Work Schedule</label>
                  <span className="form-value">{employeeData.workSchedule}</span>
                </div>
              </div>
              
              <div className="benefits-section">
                <label>Employee Benefits</label>
                <div className="benefits-list">
                  {employeeData.benefits.map((benefit, index) => (
                    <span key={index} className="benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;