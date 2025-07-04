import React, { useState, useEffect } from 'react';
import { Download, Printer, Mail, Calendar, User, Building, DollarSign } from 'lucide-react';
import './PayslipGenerator.css';
import payrollService from '../../services/PayrollServies';
import logo from "../../assets/logo1.png"

const PayslipGenerator = ({ payrollId, onClose }) => {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchPayroll = async () => {
    try {
      setLoading(true);
      console.log('Fetching payroll with ID:', payrollId);
      const data = await payrollService.getPayrollById(payrollId);
      console.log('Fetched payroll:', data);
      setPayroll(data);
      console.log("Received payrollId:", payrollId);

    } catch (err) {
      console.error('Error fetching payroll:', err);
      setError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  if (payrollId) {
    fetchPayroll();
  }
}, [payrollId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Convert to PDF or implement download logic
    alert('Download functionality would be implemented here');
  };

  const handleEmail = () => {
    if (payroll?.employee?.email) {
      const subject = `Payslip for ${payroll.payPeriod.start} to ${payroll.payPeriod.end}`;
      const body = `Dear ${payroll.employee.name},\n\nPlease find your payslip attached.\n\nBest regards,\nHR Department`;
      window.open(`mailto:${payroll.employee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthYear = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="payslip-overlay">
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading payslip...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payslip-overlay">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Error</h3>
            <p className="error-message">{error}</p>
            <button onClick={onClose} className="error-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payroll) return null;

  const totalEarnings = payroll.salary.basicSalary + 
                       payroll.salary.allowances;

  const totalDeductions = payroll.deductions.LeaveDeduction + 
                         payroll.deductions.LOP_Deduction + 
                         payroll.deductions.Late_Deduction ;

  return (
    <div className="payslip-overlay">
      <div className="payslip-container">
        {/* Header with actions */}
        <div className="payslip-header">
          <h2 className="payslip-title">Payslip Generator</h2>
          <div className="action-buttons">
            <button onClick={handlePrint} className="action-btn print-btn">
              <Printer className="btn-icon" />
              Print
            </button>
            <button onClick={handleDownload} className="action-btn download-btn">
              <Download className="btn-icon" />
              Download
            </button>
            <button onClick={handleEmail} className="action-btn email-btn">
              <Mail className="btn-icon" />
              Email
            </button>
            <button onClick={onClose} className="action-btn close-btn">
              Close
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div className="payslip-content">
          {/* Company Header */}
          <div className="company-header-new">
            <div className="company-logo-section">
              <div className="company-logo">
                <img src={logo} alt="Company Logo" className="logo-image" />
              </div>
            </div>
            <div className="company-info">
              <div className="company-address">{payroll.company.address}</div>
              <div className="company-contact">{payroll.company.email}</div>
            </div>
          </div>

          {/* Payslip Title */}
          <div className="payslip-title-section">
            <h2 className="payslip-main-title">Payslip For {getMonthYear(payroll.payPeriod.start)}</h2>
          </div>

          {/* Employee Information Table */}
          <div className="employee-info-table">
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label"><strong>Employee Id</strong></td>
                  <td className="info-value">{payroll.employee.employeeId}</td>
                  <td className="info-label"><strong>Name</strong></td>
                  <td className="info-value">{payroll.employee.name}</td>
                </tr>
                <tr>
                  <td className="info-label"><strong>Designation</strong></td>
                  <td className="info-value">{payroll.employee.position}</td>
                  <td className="info-label"><strong>LOP days</strong></td>
                  <td className="info-value">0</td>
                </tr>
                <tr>
                  <td className="info-label"><strong>Location</strong></td>
                  <td className="info-value">{payroll.company.address}</td>
                  <td className="info-label"><strong>Bank A/C</strong></td>
                  <td className="info-value">{payroll.employee.bankAccount || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Earnings and Deductions Table */}
          <div className="earnings-deductions-table">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th className="earnings-header" colSpan="2">Earnings</th>
                  <th className="deductions-header" colSpan="2">Deductions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="item-label">Basic</td>
                  <td className="amount-value">{formatCurrency(payroll.salary.basicSalary).replace('₹', '').trim()}</td>
                  <td className="item-label">Leave Deduction</td>
                  <td className="amount-value">{payroll.deductions.LeaveDeduction}.00</td>
                </tr>
                <tr>
                  <td className="item-label">House Rent and Allowance</td>
                  <td className="amount-value">{formatCurrency(payroll.salary.allowances).replace('₹', '').trim()}</td>
                  <td className="item-label">LOP Deduction</td>
                  <td className="amount-value">{payroll.deductions.LOP_Deduction}.00</td>
                </tr>
                <tr>
                  <td className="item-label">Gross Salary</td>
                  <td className="amount-value">{formatCurrency(totalEarnings).replace('₹', '').trim()}</td>
                  <td className="item-label">Late Deduction</td>
                  <td className="amount-value">{payroll.deductions.Late_Deduction}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Salary Section */}
          <div className="net-salary-section">
            <table className="net-salary-table">
              <tbody>
                <tr>
                  <td className="net-salary-label" colSpan="4"><strong>Net Pay: {formatCurrency(totalEarnings-totalDeductions)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="payslip-footer-new">
            <p>This is a computer-generated payslip and does not require a signature.</p>
            <p>For any queries, please contact HR at {payroll.company.email}</p>
            <p className="generated-date">Generated on {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;