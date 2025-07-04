import React, { useState } from 'react';
import { User, Bell, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [currentUser] = useState('Admin'); // This would come from your auth context/state
  
  const handleLogout = () => {
    // In a real app, you would clear authentication tokens and redirect to login
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully! Redirecting to login page...');
      // window.location.href = '/login';
    }
  };

  const handleNavigation = (section) => {
    // In a real app, you would handle routing here
    console.log(`Navigating to: ${section}`);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f8f9fa'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#2e3a59',
        color: 'white',
        padding: '0',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '30px 25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '22px',
            color: '#ffca28',
            fontWeight: '700',
            margin: 0
          }}>HRMS Admin</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {[
              { name: 'Dashboard', active: true },
              { name: 'Employees',link: '/employee/profile' },
              { name: 'Attendance' },
              { name: 'Leaves' },
              { name: 'Payroll', link: '/payrollAdmin' },
              { name: 'Intern Portal' },
              { name: 'Settings' }
            ].map((item, index) => (
              <li key={item.name} style={{
                margin: '4px 0'
              }}>
                {item.link ? (
                  <a href={item.link} style={{
                    display: 'block',
                    padding: '14px 25px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    borderLeft: '4px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 202, 40, 0.1)';
                    e.target.style.borderLeft = '4px solid #ffca28';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderLeft = '4px solid transparent';
                  }}>
                    {item.name}
                  </a>
                ) : (
                  <span 
                    onClick={() => handleNavigation(item.name)}
                    style={{
                      display: 'block',
                      padding: '14px 25px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      transition: 'all 0.3s ease',
                      borderLeft: item.active ? '4px solid #ffca28' : '4px solid transparent',
                      backgroundColor: item.active ? 'rgba(255, 202, 40, 0.1)' : 'transparent',
                      color: item.active ? '#ffca28' : 'white'
                    }}
                    onMouseOver={(e) => {
                      if (!item.active) {
                        e.target.style.backgroundColor = 'rgba(255, 202, 40, 0.1)';
                        e.target.style.borderLeft = '4px solid #ffca28';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!item.active) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderLeft = '4px solid transparent';
                      }
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <div style={{
          padding: '20px 25px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '260px',
        padding: '30px',
        flex: 1
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '35px',
          padding: '0 5px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              color: '#2e3a59',
              marginBottom: '5px',
              fontWeight: '600'
            }}>Welcome, {currentUser}</h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: 0
            }}>Here's a quick overview of your system</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} size={18} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: '8px 12px 8px 40px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none',
                  width: '200px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3f51b5'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
            
            {/* Notifications */}
            <button style={{
              position: 'relative',
              padding: '8px',
              backgroundColor: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#3f51b5';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#e1e5e9';
            }}>
              <Bell size={18} color="#666" />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#f44336',
                borderRadius: '50%'
              }}></span>
            </button>
            
            {/* Admin Badge */}
            <div style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={16} />
              Admin Portal
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {[
            { title: 'Total Employees', value: '48', icon: '👥', color: '#3f51b5', change: '+5%' },
            { title: 'Active Interns', value: '12', icon: '🎓', color: '#4caf50', change: '+12%' },
            { title: 'Pending Leaves', value: '6', icon: '📅', color: '#ff9800', change: '-8%' },
            { title: 'Payroll Pending', value: '3', icon: '💰', color: '#f44336', change: 'Due Today' }
          ].map((card, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: card.color
              }}></div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '12px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>{card.title}</h3>
                  <p style={{
                    fontSize: '32px',
                    color: card.color,
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                    lineHeight: '1'
                  }}>{card.value}</p>
                  {/* <span style={{
                    fontSize: '12px',
                    color: card.change.includes('+') ? '#4caf50' : 
                           card.change.includes('-') ? '#f44336' : '#666',
                    fontWeight: '500'
                  }}>{card.change}</span> */}
                </div>
                <div style={{
                  fontSize: '32px',
                  opacity: 0.3
                }}>{card.icon}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Activity */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '20px',
              color: '#2e3a59',
              fontWeight: '600',
              margin: 0
            }}>Recent Activity</h2>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              color: '#3f51b5',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e3f2fd';
              e.target.style.borderColor = '#3f51b5';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#e1e5e9';
            }}>
              View All
            </button>
          </div>
          
          <div>
            {[
              { icon: '✅', text: 'John marked attendance', time: '2 hours ago', type: 'success' },
              { icon: '📝', text: 'Priya applied for leave', time: '4 hours ago', type: 'info' },
              { icon: '📄', text: 'Kumar generated payslip', time: '6 hours ago', type: 'warning' },
              { icon: '🎓', text: 'New intern onboarded', time: '8 hours ago', type: 'success' },
              { icon: '📢', text: 'System maintenance scheduled', time: '1 day ago', type: 'info' }
            ].map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                borderRadius: '6px',
                margin: '0 -10px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: activity.type === 'success' ? '#e8f5e8' : 
                                  activity.type === 'warning' ? '#fff3e0' : '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '16px',
                  marginLeft: '10px'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: '#333',
                    fontSize: '15px',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>{activity.text}</p>
                  <span style={{
                    color: '#999',
                    fontSize: '13px'
                  }}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;