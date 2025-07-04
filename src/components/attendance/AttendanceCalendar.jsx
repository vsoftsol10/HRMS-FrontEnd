import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Users, 
  BarChart3, 
  AlertTriangle,
  MapPin,
  Navigation,
  Shield,
  ShieldCheck,
  Home,
  Building,
  Loader
} from 'lucide-react';

import "./AttendanceCalendar.css"

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [includeSaturdays, setIncludeSaturdays] = useState(false);
  const [workLocations, setWorkLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('checking'); // checking, granted, denied, unavailable
  const [geofenceStatus, setGeofenceStatus] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const REQUIRED_DAILY_HOURS = 9;
  const EMPLOYEE_ID = 'EMP001'; // This should come from authentication context

  // Company holidays for 2025
  const holidays = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-14': 'Pongal',
    '2025-01-15': 'Thiruvalluvar Day',
    '2025-01-16': 'Uzhavar Thirunal',
    '2025-01-26': 'Republic Day',
    '2025-03-14': 'Holi',
    '2025-04-14': 'Tamil New Year',
    '2025-04-18': 'Good Friday',
    '2025-08-15': 'Independence Day',
    '2025-08-16': 'Janmashtami',
    '2025-09-05': 'Ganesh Chaturthi',
    '2025-10-02': 'Gandhi Jayanti',
    '2025-11-01': 'Diwali'
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Initialize geolocation and fetch data
  useEffect(() => {
    initializeGeolocation();
    fetchWorkLocations();
    fetchAttendanceData();
  }, [currentDate]);

  const initializeGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocationStatus('granted');
        validateCurrentLocation(position.coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const validateCurrentLocation = async (coords) => {
    try {
      const response = await fetch('https://vsofthrms-production.up.railway.app/validate-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy
        })
      });

      const result = await response.json();
      if (result.success) {
        setGeofenceStatus(result.data);
      }
    } catch (error) {
      console.error('Error validating location:', error);
    }
  };

  const fetchWorkLocations = async () => {
    try {
      const response = await fetch('https://vsofthrms-production.up.railway.app/work-locations');
      const result = await response.json();
      if (result.success) {
        setWorkLocations(result.data);
      }
    } catch (error) {
    
      console.error('Error fetching work locations:', error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await fetch(`https://vsofthrms-production.up.railway.app/api/attendance-with-location/${EMPLOYEE_ID}/${year}/${month}`);
      const result = await response.json();
      if (result.success) {
        setAttendanceData(result.data);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const requestLocationPermission = () => {
    setIsLocationLoading(true);
    initializeGeolocation();
    setTimeout(() => setIsLocationLoading(false), 3000);
  };

  const refreshLocation = () => {
    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        validateCurrentLocation(position.coords);
        setIsLocationLoading(false);
      },
      (error) => {
        console.error('Error refreshing location:', error);
        setIsLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleHoursSubmit = async (date, hours, clockIn, clockOut, workFromHome = false) => {
    if (!workFromHome && locationStatus !== 'granted') {
      alert('Location access is required for office attendance. Please enable location services.');
      return;
    }

    if (!workFromHome && geofenceStatus && !geofenceStatus.isWithinGeofence) {
      const confirmSubmit = window.confirm(
        `You are ${geofenceStatus.distance}m away from the nearest work location. Are you sure you want to record attendance?`
      );
      if (!confirmSubmit) return;
    }

    try {
      const attendanceData = {
        employeeId: EMPLOYEE_ID,
        date,
        clockIn,
        clockOut,
        totalHours: hours,
        workFromHome,
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        locationAccuracy: currentLocation?.accuracy
      };

      const response = await fetch('/api/attendance-with-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData)
      });

      const result = await response.json();
      if (result.success) {
        // Refresh attendance data
        fetchAttendanceData();
        setSelectedDay(null);
      } else {
        alert(result.message || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance record');
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isHoliday = (date) => {
    return holidays[date] || null;
  };

  const getDayType = (date, dayOfWeek) => {
    const holiday = isHoliday(date);
    if (holiday) return { type: 'holiday', label: holiday };
    if (dayOfWeek === 0) return { type: 'sunday', label: 'Sunday' };
    if (dayOfWeek === 6) return { type: 'saturday', label: 'Saturday' };
    return { type: 'working', label: 'Working Day' };
  };

  const getHoursStatus = (hours) => {
    const numHours = parseFloat(hours) || 0;
    if (numHours === 0) return 'empty';
    if (numHours < REQUIRED_DAILY_HOURS) return 'insufficient';
    return 'complete';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const LocationStatusBadge = () => {
    if (locationStatus === 'checking' || isLocationLoading) {
      return (
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Checking location...</span>
        </div>
      );
    }

    if (locationStatus === 'denied') {
      return (
        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          <span>Location access denied</span>
          <button 
            onClick={requestLocationPermission}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Grant Access
          </button>
        </div>
      );
    }

    if (locationStatus === 'unavailable') {
      return (
        <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          <span>Location not available</span>
        </div>
      );
    }

    if (geofenceStatus) {
      const { isWithinGeofence, distance, workLocation, closestLocation } = geofenceStatus;
      
      if (isWithinGeofence) {
        return (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>At {workLocation.name}</span>
            <button 
              onClick={refreshLocation}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Refresh
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
            <Shield className="w-4 h-4" />
            <span>{distance}m from {closestLocation?.name || 'work'}</span>
            <button 
              onClick={refreshLocation}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Refresh
            </button>
          </div>
        );
      }
    }

    return (
      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
        <Navigation className="w-4 h-4" />
        <span>Location ready</span>
        <button 
          onClick={refreshLocation}
          className="ml-2 text-sm underline hover:no-underline"
        >
          Refresh
        </button>
      </div>
    );
  };

  const AttendanceModal = ({ date, onClose }) => {
    const [hours, setHours] = useState('');
    const [clockIn, setClockIn] = useState('');
    const [clockOut, setClockOut] = useState('');
    const [workFromHome, setWorkFromHome] = useState(false);

    const calculateHours = () => {
      if (clockIn && clockOut) {
        const [inHours, inMinutes] = clockIn.split(':').map(Number);
        const [outHours, outMinutes] = clockOut.split(':').map(Number);
        const inMinutesTotal = inHours * 60 + inMinutes;
        const outMinutesTotal = outHours * 60 + outMinutes;
        const totalMinutes = outMinutesTotal - inMinutesTotal;
        const calculatedHours = Math.max(0, totalMinutes / 60);
        setHours(calculatedHours.toFixed(1));
      }
    };

    useEffect(() => {
      calculateHours();
    }, [clockIn, clockOut]);

    const canSubmit = workFromHome || (locationStatus === 'granted' && geofenceStatus);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Record Attendance</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="text" value={date} disabled className="w-full p-2 border rounded bg-gray-50" />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wfh"
                checked={workFromHome}
                onChange={(e) => setWorkFromHome(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="wfh" className="text-sm">Work from Home</label>
              <Home className="w-4 h-4 text-gray-400" />
            </div>

            {!workFromHome && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Location Status</span>
                </div>
                <LocationStatusBadge />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Clock In</label>
                <input
                  type="time"
                  value={clockIn}
                  onChange={(e) => setClockIn(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clock Out</label>
                <input
                  type="time"
                  value={clockOut}
                  onChange={(e) => setClockOut(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Hours</label>
              <input
                type="number"
                step="0.1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter hours or use clock in/out"
              />
            </div>

            {!workFromHome && geofenceStatus && !geofenceStatus.isWithinGeofence && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">
                    You are {geofenceStatus.distance}m away from work location. 
                    Attendance will be flagged for review.
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => handleHoursSubmit(date, hours, clockIn, clockOut, workFromHome)}
                disabled={!canSubmit || !hours}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save Attendance
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();
      const dayType = getDayType(date, dayOfWeek);
      const dayData = attendanceData[date];
      const hours = dayData?.totalHours || '';
      const hoursStatus = getHoursStatus(hours);
      
      let className = 'calendar-day';
      let isEditable = false;
      
      switch (dayType.type) {
        case 'holiday':
          className += ' holiday';
          break;
        case 'sunday':
          className += ' sunday';
          break;
        case 'saturday':
          className += includeSaturdays ? ' saturday-active' : ' saturday-inactive';
          isEditable = includeSaturdays;
          break;
        case 'working':
          className += ' working';
          isEditable = true;
          break;
      }

      // Add hours status class for editable days
      if (isEditable && hours) {
        className += ` hours-${hoursStatus}`;
      }
      
      days.push(
        <div key={day} className={className}>
          <div className="day-number">{day}</div>
          <div className="day-label">
            {dayType.type === 'holiday' ? dayType.label : ''}
          </div>
          
          {/* Location indicator */}
          {dayData && (dayData.latitude || dayData.workFromHome) && (
            <div className="location-indicator">
              {dayData.workFromHome ? (
                <Home className="w-3 h-3 text-blue-600" title="Work from Home" />
              ) : dayData.isWithinGeofence ? (
                <ShieldCheck className="w-3 h-3 text-green-600" title="Within work location" />
              ) : (
                <Shield className="w-3 h-3 text-yellow-600" title={`${dayData.distanceFromWork}m from work`} />
              )}
            </div>
          )}

          {isEditable ? (
            <div className="hours-section">
              {hours ? (
                <div className="hours-display-filled">
                  <div className="hours-value">{hours}h</div>
                  {dayData?.workFromHome && (
                    <div className="wfh-badge">WFH</div>
                  )}
                  {dayData && !dayData.workFromHome && (
                    <div className="location-badge">
                      {dayData.isWithinGeofence ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-yellow-600">!</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSelectedDay(date)}
                  className="add-attendance-btn"
                >
                  + Add
                </button>
              )}
              
              {hours && hoursStatus === 'insufficient' && (
                <div className="insufficient-warning">
                  <AlertTriangle size={12} />
                  <span>Less than {REQUIRED_DAILY_HOURS}h</span>
                </div>
              )}
              {hours && hoursStatus === 'complete' && (
                <div className="complete-indicator">
                  ✓ Complete
                </div>
              )}
            </div>
          ) : (
            <div className="hours-display">
              {dayType.type === 'sunday' ? 'Weekly Leave' : 
               dayType.type === 'holiday' ? 'Holiday' :
               dayType.type === 'saturday' && !includeSaturdays ? 'Saturday' : ''}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const calculateSummary = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    
    let totalWorkingDays = 0;
    let totalHoursEntered = 0;
    let daysWithHours = 0;
    let daysWithInsufficientHours = 0;
    let daysWithCompleteHours = 0;
    let totalRequiredHours = 0;
    let wfhDays = 0;
    let geofenceViolations = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();
      const dayType = getDayType(date, dayOfWeek);
      const dayData = attendanceData[date];

      if (dayType.type === 'working' || (dayType.type === 'saturday' && includeSaturdays)) {
        totalWorkingDays++;
        totalRequiredHours += REQUIRED_DAILY_HOURS;
        
        if (dayData && dayData.totalHours > 0) {
          totalHoursEntered += dayData.totalHours;
          daysWithHours++;
          
          if (dayData.totalHours >= REQUIRED_DAILY_HOURS) {
            daysWithCompleteHours++;
          } else {
            daysWithInsufficientHours++;
          }

          if (dayData.workFromHome) {
            wfhDays++;
          }

          if (dayData.latitude && !dayData.workFromHome && !dayData.isWithinGeofence) {
            geofenceViolations++;
          }
        }
      }
    }

    return {
      totalWorkingDays,
      totalHoursEntered,
      totalRequiredHours,
      daysWithHours,
      daysWithCompleteHours,
      daysWithInsufficientHours,
      wfhDays,
      geofenceViolations,
      averageHours: daysWithHours > 0 ? (totalHoursEntered / daysWithHours).toFixed(1) : 0,
      completionRate: totalWorkingDays > 0 ? ((daysWithCompleteHours / totalWorkingDays) * 100).toFixed(1) : 0,
      hoursDeficit: Math.max(0, totalRequiredHours - totalHoursEntered)
    };
  };

  const summary = calculateSummary();

  return (
    <div className="attendance-app">
    
      
      <div className="container">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-title-section">
              <Calendar className="header-icon text-blue-600" />
              <h1 className="header-title">
                Geofenced Attendance System
              </h1>
            </div>
            <div className="header-nav">
              <button 
                onClick={() => navigateMonth(-1)}
                className="nav-button"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="month-title">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="nav-button"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Location Status & Controls */}
       {/* Location Status & Controls */}
     <div className="controls-card">
        <div className="location-alert">
            <svg className="alert-icon" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            <span>Location access denied</span>
            <button className="grant-access-btn">Grant Access</button>
            <button className="view-locations-btn" style={{marginLeft: '8px'}}>
                <svg className="building-icon" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 16.5V4a1 1 0 011-1h4a1 1 0 011 1v.5h4a1 1 0 011 1v11a1 1 0 01-1 1H5a1 1 0 01-1-1zm7-1.5V6h2v9h-2z" clipRule="evenodd"/>
                </svg>
                <span>View Work Locations</span>
            </button>
        </div>

        <div className="checkbox-row">
            <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" id="includeSaturdays"/>
                <span>Include Saturdays as Working Days</span>
            </label>
        </div>

        <div className="legend-grid">
            <div className="legend-item">
                <div className="legend-color-box legend-working-days"></div>
                <span>Working Days</span>
            </div>
            <div className="legend-item">
                <div className="legend-color-box legend-sunday"></div>
                <span>Sunday</span>
            </div>
            <div className="legend-item">
                <div className="legend-color-box legend-holiday"></div>
                <span>Holiday</span>
            </div>
            <div className="legend-item">
                <div className="legend-color-box legend-complete"></div>
                <span>Complete (≥9h)</span>
            </div>
            <div className="legend-item">
                <div className="legend-color-box legend-insufficient"></div>
                <span>Insufficient (&lt;9h)</span>
            </div>
            <div className="legend-item">
                <svg className="legend-icon wfh-icon" viewBox="0 0 20 20">
                    <path d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"/>
                </svg>
                <span>WFH</span>
            </div>
            <div className="legend-item">
                <svg className="legend-icon verified-icon" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Verified Location</span>
            </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Calendar Section */}
          <div className="calendar-card">
            <div className="weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-grid">
              {renderCalendar()}
            </div>
          </div>

          {/* Summary Section */}
          <div className="summary-card">
            <div className="summary-header">
              <BarChart3 className="summary-icon text-blue-600" />
              <h3 className="summary-title">Monthly Summary</h3>
            </div>
            
            <div className="summary-stats">
              {[
                { icon: Calendar, label: 'Total Working Days', value: summary.totalWorkingDays, color: '#667eea' },
                { icon: Clock, label: 'Total Hours Entered', value: summary.totalHoursEntered.toFixed(1), color: '#4299e1' },
                { icon: Users, label: 'Average Hours/Day', value: summary.averageHours, color: '#38b2ac' },
                { icon: BarChart3, label: 'Completion Rate', value: `${summary.completionRate}%`, color: '#48bb78' },
              ].map((item, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${item.color}, #764ba2)` }}>
                    <item.icon size={20} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{item.value}</div>
                    <div className="stat-label">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Location-based stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Work from Home Days</span>
                </div>
                <span className="font-semibold text-blue-800">{summary.wfhDays}</span>
              </div>

              {summary.geofenceViolations > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Location Violations</span>
                  </div>
                  <span className="font-semibold text-yellow-800">{summary.geofenceViolations}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Hours Deficit</span>
                </div>
                <span className="font-semibold text-gray-800">{summary.hoursDeficit.toFixed(1)}h</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{summary.daysWithCompleteHours}/{summary.totalWorkingDays} days completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${summary.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {selectedDay && (
        <AttendanceModal 
          date={selectedDay} 
          onClose={() => setSelectedDay(null)} 
        />
      )}

      {/* Work Locations Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-80vh overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Work Locations</h3>
              <button 
                onClick={() => setShowLocationModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {workLocations.map((location) => (
                <div key={location.id} className="p-3 border rounded-lg">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-600">{location.address}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Radius: {location.radius_meters}m | 
                    Status: {location.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;