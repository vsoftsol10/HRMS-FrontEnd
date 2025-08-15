import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, Users, Award, X, Loader } from 'lucide-react';
import "./CourseDashboard1.css"
import logo from "../../assets/logo1.png"
import Footer from './Footer';

const CourseDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL =  'https://hrms-backend-5wau.onrender.com';

  // Fetch courses from backend
  // Optimized fetchCourses function with timeout and better error handling
const fetchCourses = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      setCourses(data.data);
      console.log('✅ Courses loaded from API');
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  } catch (err) {
    console.error('❌ Error fetching courses:', err);
    
    if (err.name === 'AbortError') {
      setError('Request timeout - using offline data');
    } else {
      setError(err.message);
    }
    
    // Immediately load fallback data
    const fallbackCourses = [
      {
        id: 1,
        title: "Cloud Computing Basics",
        cardColor: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
        platforms: ["AWS", "Azure", "Google Cloud Platform"],
        description: "Master cloud technologies with hands-on experience across AWS, Azure, and Google Cloud Platform.",
        duration: "3 months",
        students: "50+",
        level: "Intermediate",
        skillTags: ["EC2", "S3", "+3 more"],
        courseType: "Internship/Course",
        topics: [
          "Basics of GCP",
          "GCP Virtual Machines & Storage",
          "Google Cloud Compute Engine",
          "Cloud Security & Best Practices",
          "DevOps & CI/CD",
          "Serverless Architecture"
        ],
        features: [
          "Real-time working experience",
          "Industry certification preparation",
          "Placement support for top performers"
        ]
      },
      // ... rest of your fallback courses
    ];
    setCourses(fallbackCourses);
    console.log('📱 Using fallback course data');
  } finally {
    setLoading(false);
  }
}; 

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
  };

  // Handle enrollment (you can customize this)
  const handleEnrollment = (courseId) => {
    // Add your enrollment logic here
    console.log(`Enrolling in course ${courseId}`);
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdtW3UbEpW_1bzr_81qEgzdF-JDN-bfgv23s9zVdQ8grAJ4YQ/viewform", "_blank");
  };

  // // Handle contact us (you can customize this)
  // const handleContactUs = () => {
  //   // Add your contact logic here
  //   alert('Redirecting to contact form...');
  // };

  if (loading) {
    return (
      <div className="course-dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Loader size={48} className="animate-spin" />
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-dashboard">
      {/* Header */}
      <header className="dashboard-header">         
        <div className="logo-section">           
          <div className="company-logo">             
            <span><img src={logo} alt="Logo" style={{width:'100%'}} /></span>           
          </div>         
        </div>           
        <div className="spacer"></div>       
        <div className='headerText'>
          <h2>Learning Today for a Smarter Tomorrow</h2>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem',
          margin: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p>⚠️ Using offline data. Could not connect to server: {error}</p>
          <button 
            onClick={fetchCourses}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Courses Section */}
      <main className="dashboard-main">
        <div className="courses-header">
          <h2>Courses We Offer</h2>
          <p>Choose from our comprehensive range of technology courses</p>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card" onClick={() => openCourseDetails(course)}>
              <div className="course-icon">
                {course.icon}
              </div>
              <h3 className="course-title">{course.title}</h3>
              <div className="course-platforms">
                {course.platforms && course.platforms.map((platform, index) => (
                  <span key={index} className="platform-tag">{platform}</span>
                ))}
              </div>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.students}</span>
                </div>
              </div>
              <div className="course-cta">
                <span>View Details</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={closeCourseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCourse.title}</h2>
              <button className="close-btn" onClick={closeCourseDetails}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="course-overview">
                <div className="overview-stats">
                  <div className="stat-item">
                    <Clock size={20} />
                    <div>
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{selectedCourse.duration}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Users size={20} />
                    <div>
                      <span className="stat-label">Students</span>
                      <span className="stat-value">{selectedCourse.students}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Award size={20} />
                    <div>
                      <span className="stat-label">Level</span>
                      <span className="stat-value">{selectedCourse.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-details">
                <div className="detail-section">
                  <h3>Course Topics</h3>
                  <ul className="topics-list">
                    {selectedCourse.topics && selectedCourse.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {selectedCourse.features && selectedCourse.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Technologies</h3>
                  <div className="tech-tags">
                    {selectedCourse.platforms && selectedCourse.platforms.map((platform, index) => (
                      <span key={index} className="tech-tag">{platform}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="enroll-btn" 
                onClick={() => handleEnrollment(selectedCourse.id)}
              >
                Enroll Now
              </button>
              {/* <button 
                className="contact-btn" 
                onClick={handleContactUs}
              >
                Contact Us
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default CourseDashboard;