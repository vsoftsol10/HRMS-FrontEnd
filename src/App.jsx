import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
// import PayslipGenerator from './components/payroll/PaySlipGenerator'
import PayrollPage from './pages/PayrollPage'
import InternDashboardPage from './pages/InternDashboardPage'
import PayrollAdmin from './components/payroll/PayrollAdmin'
import AdminDashboard from './components/dashboard/AdminDashboard'
import LandingPage from './components/LandingPage/LandingPage'
import EmployeeLogin from './pages/login/EmployeeLogin'
import AdminLogin from './pages/login/AdminLogin'
import EmployeeProfile from './components/employee/EmployeeProfile'
import MyProfile from './components/employee/MyProfile'
import AttendanceCalendar from './components/attendance/AttendanceCalendar'
import CourseDashboard from './components/dashboard/CourseDashboard'
import InternLogin from './components/intern/InternLogin'
import InternEmailVerification from './components/intern/InternEmailVerification'
import EmployeeDashboard1 from './components/dashboard/EmployeeDashboard1'
import AdminIntern from './pages/AdminIntern'
import NotFoundPage from './pages/NotFoundPage'



function App() {
const employeeCode = 'VSEMP03';
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/employee/login' element={<EmployeeLogin/>} />
      <Route path='/admin/login' element={<AdminLogin/>} />
      <Route path='/admin/dashboard' element={<AdminDashboard/>} />
      <Route path='/employee/dashboard' element={<EmployeeDashboard1/>} />
      <Route path="/profile/:employeeId" element={<MyProfile />} />
      <Route path='/employee/profile' element={<EmployeeProfile/>} />
      <Route path='/employee/calendar' element={<AttendanceCalendar/>} />
      <Route path='/payslip/:id' element={<PayrollPage/>} />
      <Route path='/payrollAdmin' element={<PayrollAdmin/>} />
      <Route path='/admin/intern' element={<AdminIntern/>} />
      <Route path='/verify-email' element={<InternEmailVerification />} />
      <Route path='/intern/login' element={<InternLogin/>} />
      <Route path='/intern/dashboard' element={<InternDashboardPage/>} />
      <Route path='/learn/course' element={<CourseDashboard/>} />
      <Route path="*" element={<NotFoundPage/>} />

    </Routes>
  )
}

export default App
