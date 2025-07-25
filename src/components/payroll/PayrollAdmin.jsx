import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, DollarSign, Calendar, Building } from 'lucide-react';
import './PayrollAdmin.css';

const PayrollAdmin = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const API_BASE_URL = "https://hrms-backend-5wau.onrender.com";
 
  const fetchPayrollList = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payroll`);
      const data = await res.json();
      setPayrolls(data);
    } catch (err) {
      console.error('Error fetching payrolls:', err);
      // Fallback to mock data if API fails
      const mockData = [
        {
          id: 1,
          payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
          company: {
            name: 'VSoft Solutions',
            address: 'Tirunelveli, TN, India',
            phone: '+91-9876543210',
            email: 'info@thevsoft.com'
          },
          employee: {
            name: 'Vigneshwaran',
            employeeId: 'EMP001',
            position: 'Software Developer',
            department: 'Engineering',
            email: 'vignesh@vsoft.com'
          },
          salary: {
            basicSalary: 30000,
            overtime: 1000,
            bonus: 2000,
            allowances: 3000
          },
          deductions: {
            LeaveDeduction: 0,
            LOP_Deduction: 316,
            Late_Deduction: 100
          }
        },
        {
          id: 2,
          payPeriod: { start: '2024-01-01', end: '2024-01-31', payDate: '2024-02-01' },
          company: {
            name: 'VSoft Solutions',
            address: 'Tirunelveli, TN, India',
            phone: '+91-9876543210',
            email: 'info@thevsoft.com'
          },
          employee: {
            name: 'Karthik',
            employeeId: 'EMP002',
            position: 'Graphics Designer',
            department: 'Engineering',
            email: 'karthik@vsoft.com'
          },
          salary: {
            basicSalary: 35000,
            overtime: 1000,
            bonus: 2000,
            allowances: 3000
          },
          deductions: {
            LeaveDeduction: 0,
            LOP_Deduction: 316,
            Late_Deduction: 100
          }
        }
      ];
      setPayrolls(mockData);
    }
  };
  
  useEffect(() => {
    fetchPayrollList();
  }, []);

  const [formData, setFormData] = useState({
    payPeriod: { start: '', end: '', payDate: '' },
    company: {
      name: 'VSoft Solutions',
      address: 'Tirunelveli, TN, India',
      phone: '+91-9876543210',
      email: 'info@thevsoft.com'
    },
    employee: {
      name: '',
      employeeId: '',
      position: '',
      department: 'Engineering',
      email: ''
    },
    salary: {
      basicSalary: 0,
      overtime: 0,
      bonus: 0,
      allowances: 0
    },
    deductions: {
      LeaveDeduction: 0,
      LOP_Deduction: 0,
      Late_Deduction: 0
    }
  });

  const calculateTotal = (salary, deductions) => {
    const totalSalary = salary.basicSalary + salary.overtime + salary.bonus + salary.allowances;
    const totalDeductions = deductions.LeaveDeduction + deductions.LOP_Deduction + deductions.Late_Deduction;
    return totalSalary - totalDeductions;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: section === 'salary' || section === 'deductions' ? Number(value) || 0 : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingPayroll
      ? `${API_BASE_URL}/api/payroll/${editingPayroll.id}`
      : `${API_BASE_URL}/api/payroll`;

    const method = editingPayroll ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Something went wrong');

      const data = await res.json();
      console.log('Payroll saved:', data);

      // Refresh the payroll list
      fetchPayrollList();
      setIsModalOpen(false);
      setEditingPayroll(null);
      resetFormData();

    } catch (err) {
      console.error(err);
      // Fallback to local state update if API fails
      if (editingPayroll) {
        setPayrolls(prev => prev.map(p => 
          p.id === editingPayroll.id ? { ...formData, id: editingPayroll.id } : p
        ));
      } else {
        const newPayroll = { ...formData, id: Date.now() };
        setPayrolls(prev => [...prev, newPayroll]);
      }
      setIsModalOpen(false);
      setEditingPayroll(null);
      resetFormData();
    }
  };

  const handleEdit = (payroll) => {
    setEditingPayroll(payroll);
    setFormData(payroll);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payroll/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete');

        // Refresh the payroll list
        fetchPayrollList();
      } catch (err) {
        console.error('Error deleting payroll:', err);
        // Fallback to local state update if API fails
        setPayrolls(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  const resetFormData = () => {
    setFormData({
      payPeriod: { start: '', end: '', payDate: '' },
      company: {
        name: 'VSoft Solutions',
        address: 'Tirunelveli, TN, India',
        phone: '+91-9876543210',
        email: 'info@thevsoft.com'
      },
      employee: {
        name: '',
        employeeId: '',
        position: '',
        department: 'Engineering',
        email: ''
      },
      salary: {
        basicSalary: 0,
        overtime: 0,
        bonus: 0,
        allowances: 0
      },
      deductions: {
        LeaveDeduction: 0,
        LOP_Deduction: 0,
        Late_Deduction: 0
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPayroll(null);
    resetFormData();
  };

  return (
    <div className="vsoft-payroll-admin-container">
      {/* Header */}
      <div className="vsoft-payroll-header">
        <div className="vsoft-payroll-header-content">
          <div className="vsoft-payroll-header-left">
            <Building size={32} />
            <div>
              <h1>VSoft Solutions</h1>
              <p>Payroll Management System</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="vsoft-payroll-add-button"
          >
            <Plus size={20} />
            Add New Payroll
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="vsoft-payroll-main-content">
        {/* Stats Cards */}
        <div className="vsoft-payroll-stats-grid">
          <div className="vsoft-payroll-stat-card">
            <div className="vsoft-payroll-stat-content">
              <div className="vsoft-payroll-stat-icon">
                <Users size={24} />
              </div>
              <div>
                <p className="vsoft-payroll-stat-label">Total Employees</p>
                <h3 className="vsoft-payroll-stat-value">{payrolls.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="vsoft-payroll-stat-card">
            <div className="vsoft-payroll-stat-content">
              <div className="vsoft-payroll-stat-icon">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="vsoft-payroll-stat-label">Total Payroll</p>
                <h3 className="vsoft-payroll-stat-value">
                  ₹{payrolls.reduce((sum, p) => sum + calculateTotal(p.salary, p.deductions), 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll List */}
        <div className="vsoft-payroll-list-container">
          <div className="vsoft-payroll-list-header">
            <h2>Employee Payrolls</h2>
          </div>
          
          <div className="vsoft-payroll-table-wrapper">
            <table className="vsoft-payroll-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Pay Period</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => {
                  const grossSalary = payroll.salary.basicSalary + payroll.salary.overtime + payroll.salary.bonus + payroll.salary.allowances;
                  const totalDeductions = payroll.deductions.LeaveDeduction + payroll.deductions.LOP_Deduction + payroll.deductions.Late_Deduction;
                  const netSalary = grossSalary - totalDeductions;
                  
                  return (
                    <tr key={payroll.id}>
                      <td>
                        <div className="vsoft-payroll-employee-info">
                          <div className="vsoft-payroll-employee-name">{payroll.employee.name}</div>
                          <div className="vsoft-payroll-employee-id">{payroll.employee.employeeId}</div>
                        </div>
                      </td>
                      <td>{payroll.employee.position}</td>
                      <td>
                        {new Date(payroll.payPeriod.start).toLocaleDateString()} - {new Date(payroll.payPeriod.end).toLocaleDateString()}
                      </td>
                      <td className="vsoft-payroll-gross-salary">₹{grossSalary.toLocaleString()}</td>
                      <td className="vsoft-payroll-deductions">₹{totalDeductions.toLocaleString()}</td>
                      <td className="vsoft-payroll-net-salary">₹{netSalary.toLocaleString()}</td>
                      <td>
                        <div className="vsoft-payroll-action-buttons">
                          <button
                            onClick={() => handleEdit(payroll)}
                            className="vsoft-payroll-edit-button"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(payroll.id)}
                            className="vsoft-payroll-delete-button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="vsoft-payroll-modal-overlay">
          <div className="vsoft-payroll-modal">
            <div className="vsoft-payroll-modal-header">
              <h2>{editingPayroll ? 'Edit Payroll' : 'Add New Payroll'}</h2>
              <button onClick={closeModal} className="vsoft-payroll-close-button">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="vsoft-payroll-modal-form">
              {/* Pay Period Section */}
              <div className="vsoft-payroll-form-section">
                <h3 className="vsoft-payroll-section-title">
                  <Calendar size={20} />
                  Pay Period
                </h3>
                <div className="vsoft-payroll-form-grid">
                  <div className="vsoft-payroll-form-field">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={formData.payPeriod.start}
                      onChange={(e) => handleInputChange('payPeriod', 'start', e.target.value)}
                      required
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={formData.payPeriod.end}
                      onChange={(e) => handleInputChange('payPeriod', 'end', e.target.value)}
                      required
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Pay Date</label>
                    <input
                      type="date"
                      value={formData.payPeriod.payDate}
                      onChange={(e) => handleInputChange('payPeriod', 'payDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Employee Section */}
              <div className="vsoft-payroll-form-section">
                <h3 className="vsoft-payroll-section-title">
                  <Users size={20} />
                  Employee Details
                </h3>
                <div className="vsoft-payroll-form-grid">
                  <div className="vsoft-payroll-form-field">
                    <label>Employee Name</label>
                    <input
                      type="text"
                      value={formData.employee.name}
                      onChange={(e) => handleInputChange('employee', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Employee ID</label>
                    <input
                      type="text"
                      value={formData.employee.employeeId}
                      onChange={(e) => handleInputChange('employee', 'employeeId', e.target.value)}
                      required
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Position</label>
                    <input
                      type="text"
                      value={formData.employee.position}
                      onChange={(e) => handleInputChange('employee', 'position', e.target.value)}
                      required
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.employee.email}
                      onChange={(e) => handleInputChange('employee', 'email', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div className="vsoft-payroll-form-section">
                <h3 className="vsoft-payroll-section-title">
                  <DollarSign size={20} />
                  Salary Details
                </h3>
                <div className="vsoft-payroll-form-grid">
                  <div className="vsoft-payroll-form-field">
                    <label>Basic Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.basicSalary}
                      onChange={(e) => handleInputChange('salary', 'basicSalary', e.target.value)}
                      required
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Overtime (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.overtime}
                      onChange={(e) => handleInputChange('salary', 'overtime', e.target.value)}
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Bonus (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.bonus}
                      onChange={(e) => handleInputChange('salary', 'bonus', e.target.value)}
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Allowances (₹)</label>
                    <input
                      type="number"
                      value={formData.salary.allowances}
                      onChange={(e) => handleInputChange('salary', 'allowances', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div className="vsoft-payroll-form-section">
                <h3 className="vsoft-payroll-section-title">Deductions</h3>
                <div className="vsoft-payroll-form-grid">
                  <div className="vsoft-payroll-form-field">
                    <label>Leave Deduction (₹)</label>
                    <input
                      type="number"
                      value={formData.deductions.LeaveDeduction}
                      onChange={(e) => handleInputChange('deductions', 'LeaveDeduction', e.target.value)}
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>LOP Deduction (₹)</label>
                    <input
                      type="number"
                      value={formData.deductions.LOP_Deduction}
                      onChange={(e) => handleInputChange('deductions', 'LOP_Deduction', e.target.value)}
                    />
                  </div>
                  <div className="vsoft-payroll-form-field">
                    <label>Late Deduction (₹)</label>
                    <input
                      type="number"
                      value={formData.deductions.Late_Deduction}
                      onChange={(e) => handleInputChange('deductions', 'Late_Deduction', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="vsoft-payroll-form-actions">
                <button type="button" onClick={closeModal} className="vsoft-payroll-cancel-button">
                  <X size={16} />
                  Cancel
                </button>
                <button type="submit" className="vsoft-payroll-submit-button">
                  <Save size={16} />
                  {editingPayroll ? 'Update' : 'Save'} Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollAdmin;