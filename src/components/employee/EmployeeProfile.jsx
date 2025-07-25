import React, { useState, useEffect } from 'react';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    religion: '',
    personalEmail: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    departmentId: '',
    positionId: '',
    managerId: '',
    hireDate: '',
    probationEndDate: '',
    confirmationDate: '',
    employmentType: 'full-time',
    workLocation: 'office',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchDropdownData();
  }, []);

  const fetchEmployees = async () => {
    try {
      setError(null);
      const response = await fetch('https://hrms-backend-5wau.onrender.com/api/employees');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle case where API returns error object instead of array
      if (data.error || data.message) {
        throw new Error(data.message || data.error || 'Unknown error occurred');
      }
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', typeof data, data);
        throw new Error('Invalid data format received from server');
      }
      
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error.message);
      setEmployees([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [deptRes, posRes, manRes] = await Promise.all([
        fetch('https://hrms-backend-5wau.onrender.com/api/departments'),
        fetch('https://hrms-backend-5wau.onrender.com/api/positions'),
        fetch('https://hrms-backend-5wau.onrender.com/api/managers')
      ]);
      
      // Check if all requests were successful
      const responses = [deptRes, posRes, manRes];
      const allSuccessful = responses.every(res => res.ok);
      
      if (!allSuccessful) {
        console.warn('Some dropdown data requests failed');
      }
      
      const [deptData, posData, manData] = await Promise.all([
        deptRes.ok ? deptRes.json() : [],
        posRes.ok ? posRes.json() : [],
        manRes.ok ? manRes.json() : []
      ]);

      setDepartments(Array.isArray(deptData) ? deptData : []);
      setPositions(Array.isArray(posData) ? posData : []);
      setManagers(Array.isArray(manData) ? manData : []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      // Set empty arrays as fallback
      setDepartments([]);
      setPositions([]);
      setManagers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      employeeCode: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      religion: '',
      personalEmail: '',
      phone: '',
      alternatePhone: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      departmentId: '',
      positionId: '',
      managerId: '',
      hireDate: '',
      probationEndDate: '',
      confirmationDate: '',
      employmentType: 'full-time',
      workLocation: 'office',
      status: 'active',
      notes: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsEditing(false);
    setCurrentEmployee(null);
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setFormData({
      employeeCode: employee.employeeCode || '',
      firstName: employee.firstName || '',
      middleName: employee.middleName || '',
      lastName: employee.lastName || '',
      dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
      gender: employee.gender || '',
      maritalStatus: employee.maritalStatus || '',
      nationality: employee.nationality || '',
      religion: employee.religion || '',
      personalEmail: employee.personalEmail || '',
      phone: employee.phone || '',
      alternatePhone: employee.alternatePhone || '',
      address: employee.address || '',
      city: employee.city || '',
      state: employee.state || '',
      country: employee.country || 'India',
      postalCode: employee.postalCode || '',
      emergencyContactName: employee.emergencyContactName || '',
      emergencyContactPhone: employee.emergencyContactPhone || '',
      emergencyContactRelationship: employee.emergencyContactRelationship || '',
      departmentId: employee.departmentId || '',
      positionId: employee.positionId || '',
      managerId: employee.managerId || '',
      hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
      probationEndDate: employee.probationEndDate ? employee.probationEndDate.split('T')[0] : '',
      confirmationDate: employee.confirmationDate ? employee.confirmationDate.split('T')[0] : '',
      employmentType: employee.employmentType || 'full-time',
      workLocation: employee.workLocation || 'office',
      status: employee.status || 'active',
      notes: employee.notes || ''
    });
    setCurrentEmployee(employee);
    setIsEditing(true);
    setShowModal(true);
  };
const cleanFormData = {
  ...formData,
  departmentId: formData.departmentId || null,
  positionId: formData.positionId || null,
  managerId: formData.managerId || null
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `https://hrms-backend-5wau.onrender.com/api/employees/${currentEmployee.id}`
        : 'https://hrms-backend-5wau.onrender.com/api/employees';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData),
      });

      if (response.ok) {
        await fetchEmployees(); // Refresh the employee list
        setShowModal(false);
        resetForm();
        alert(isEditing ? 'Employee updated successfully!' : 'Employee added successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`https://hrms-backend-5wau.onrender.com/api/employees/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchEmployees(); // Refresh the employee list
          alert('Employee deleted successfully!');
        } else {
          const error = await response.json();
          alert(error.message || 'Error deleting employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee: ' + error.message);
      }
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (employee.fullName && employee.fullName.toLowerCase().includes(searchLower)) ||
      (employee.employeeCode && employee.employeeCode.toLowerCase().includes(searchLower)) ||
      (employee.departmentName && employee.departmentName.toLowerCase().includes(searchLower)) ||
      (employee.positionTitle && employee.positionTitle.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Employees</h2>
        <p>{error}</p>
        <button onClick={fetchEmployees} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <div className="header-left">
          <h1>Employee Management</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <button className="add-employee-btn" onClick={openAddModal}>
          <span className="plus-icon">+</span>
          Add Employee
        </button>
      </div>

      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <div className="employee-card-header">
              <div className="employee-avatar">
                {employee.firstName && employee.lastName 
                  ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
                  : '??'
                }
              </div>
              <div className="employee-info">
                <h3>{employee.fullName || 'N/A'}</h3>
                <p className="employee-code">{employee.employeeCode || 'N/A'}</p>
                <span className={`status-badge ${employee.status || 'unknown'}`}>
                  {employee.status || 'unknown'}
                </span>
              </div>
            </div>
            
            <div className="employee-details">
              <div className="detail-row">
                <span className="label">Department:</span>
                <span>{employee.departmentName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Position:</span>
                <span>{employee.positionTitle || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span>{employee.personalEmail || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span>{employee.phone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Hire Date:</span>
                <span>{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Employment Type:</span>
                <span>{employee.employmentType || 'N/A'}</span>
              </div>
            </div>

            <div className="employee-actions">
              <button 
                className="edit-btn"
                onClick={() => openEditModal(employee)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(employee.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && !loading && (
        <div className="no-employees">
          <p>No employees found.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-sections">
                {/* Personal Information */}
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Employee Code *</label>
                      <input
                        type="text"
                        name="employeeCode"
                        value={formData.employeeCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Marital Status</label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Religion</label>
                      <input
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                  <h3>Contact Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Personal Email</label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="form-section">
                  <h3>Emergency Contact</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Emergency Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Emergency Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        name="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="form-section">
                  <h3>Employment Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <select
                        name="positionId"
                        value={formData.positionId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Position</option>
                        {positions.map(pos => (
                          <option key={pos.id} value={pos.id}>
                            {pos.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Manager</label>
                      <select
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Manager</option>
                        {managers.map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Hire Date *</label>
                      <input
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Probation End Date</label>
                      <input
                        type="date"
                        name="probationEndDate"
                        value={formData.probationEndDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirmation Date</label>
                      <input
                        type="date"
                        name="confirmationDate"
                        value={formData.confirmationDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Employment Type</label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Intern</option>
                        <option value="consultant">Consultant</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Work Location</label>
                      <select
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleInputChange}
                      >
                        <option value="office">Office</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                        <option value="suspended">Suspended</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;