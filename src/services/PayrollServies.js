// services/PayrollService.js
import { api } from './api';

class PayrollService {
  async getAllPayrolls(params = {}) {
    try {
      const response = await api.get('/payroll', { params });
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async getPayrollById(id) {
    try {
      const response = await api.get(`/payroll/${id}`);
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async createPayroll(payrollData) {
    try {
      const response = await api.post('/payroll', payrollData);
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async updatePayroll(id, payrollData) {
    try {
      const response = await api.put(`/payroll/${id}`, payrollData);
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async deletePayroll(id) {
    try {
      const response = await api.delete(`/payroll/${id}`);
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async updatePaymentStatus(id, statusData) {
    try {
      const response = await api.patch(`/payroll/${id}/payment-status`, statusData);
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async generateBulkPayroll(bulkData) {
    try {
      const response = await api.post('/payroll/bulk', bulkData);
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async getEmployeePayrollSummary(employeeId, year = new Date().getFullYear()) {
    try {
      const response = await api.get(`/payroll/employee/${employeeId}/summary`, {
        params: { year }
      });
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async getPayrollStatistics(params = {}) {
    try {
      const response = await api.get('/payroll/statistics', { params });
      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async generatePayslipPDF(payrollId) {
    try {
      const response = await api.get(`/payroll/${payrollId}/payslip`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip-${payrollId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  async exportPayrollData(params = {}) {
    try {
      const response = await api.get('/payroll/export', {
        params,
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payroll-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      this.handleAndThrow(error);
    }
  }

  handleAndThrow(error) {
    const customError = this.handleError(error);
    console.error('Payroll API Error:', customError);
    throw new Error(customError.message);
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        status,
        message: data.message || 'Server responded with an error.',
        errors: data.errors || []
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: []
      };
    } else {
      return {
        status: 0,
        message: error.message || 'Unexpected error occurred.',
        errors: []
      };
    }
  }
}

export default new PayrollService();
