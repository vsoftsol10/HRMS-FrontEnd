import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import payrollService from '../../services/payrollService';

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedPayrolls, setSelectedPayrolls] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPayrolls();
  }, [filters]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const response = await payrollService.getAllPayrolls(filters);
      setPayrolls(response.data);
      setPagination(response.pagination);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payroll records');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status: status === filters.status ? '' : status, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSelectPayroll = (payrollId) => {
    setSelectedPayrolls(prev => 
      prev.includes(payrollId) 
        ? prev.filter(id => id !== payrollId)
        : [...prev, payrollId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayrolls.length === payrolls.length) {
      setSelectedPayrolls([]);
    } else {
      setSelectedPayrolls(payrolls.map(p => p.id));
    }
  };

  const updatePaymentStatus = async (payrollId, status) => {
    try {
      await payrollService.updatePaymentStatus(payrollId, { 
        status, 
        payment_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null 
      });
      fetchPayrolls();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600">Manage employee payroll records and payments</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus size={20} />
            New Payroll
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by employee name, ID..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } border`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter('paid')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.status === 'paid' 
                  ? 'bg-green-100 text-green-800 border-green-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } border`}
            >
              Paid
            </button>
            <button
              onClick={() => handleStatusFilter('cancelled')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.status === 'cancelled' 
                  ? 'bg-red-100 text-red-800 border-red-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } border`}
            >
              Cancelled
            </button>
          </div>
        )}
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayrolls.length === payrolls.length && payrolls.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pay Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayrolls.includes(payroll.id)}
                      onChange={() => handleSelectPayroll(payroll.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {payroll.first_name?.[0]}{payroll.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payroll.first_name} {payroll.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {payroll.emp_code} • {payroll.department_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      {formatDate(payroll.pay_period_start)} - {formatDate(payroll.pay_period_end)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(payroll.gross_salary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(payroll.total_deductions)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {formatCurrency(payroll.net_salary)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payroll.payment_status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      {payroll.payment_status === 'pending' && (
                        <button
                          onClick={() => updatePaymentStatus(payroll.id, 'paid')}
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Paid"
                        >
                          <DollarSign size={16} />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {payrolls.length === 0 && !loading && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payroll records</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new payroll record.
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
              <Plus size={20} />
              New Payroll
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollList;