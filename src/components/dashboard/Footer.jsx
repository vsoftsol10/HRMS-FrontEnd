import React from 'react';
import { Instagram, LinkedIn, Phone, Language, Email, LocationOn } from '@mui/icons-material';
import "./Footer.css";
import logo from "../../assets/logo1.png";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        {/* Company Info Section */}
        <div className="footer-section company-info">
          <div className="logo-container">
            <img src={logo} alt="Vsoft Solutions Logo" className="logo-image" />
          </div>
          <div className="company-description">
            <p>Leading IT company in Tirunelveli offering cutting-edge software development, web and mobile app solutions, and digital transformation services for businesses of all sizes.</p>
          </div>
          <div className="address-section">
            <div className="address-item">
              <LocationOn className="address-icon" />
              <div className="address-text">
                <p>10J2, 2nd Block, Tiruvandrum Road</p>
                <p>Vannarapettai, Tirunelveli</p>
                <p>Tamil Nadu - 627002, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact-section">
          <h4>Contact Information</h4>
          <div className="contact-list">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Phone</span>
                <a href="tel:+919095422237" className="contact-value">+91 90954 22237</a>
              </div>
            </div>
            <div className="contact-item">
              <Email className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Email</span>
                <a href="mailto:info@thevsoft.com" className="contact-value">info@thevsoft.com</a>
              </div>
            </div>
            <div className="contact-item">
              <Language className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Website</span>
                <a 
                  href="https://www.thevsoft.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-value"
                >
                  www.thevsoft.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social-section">
          <h4>Connect With Us</h4>
          <div className="social-container">
            <a
              href="https://www.instagram.com/thevsoft?igsh=MXdiMTlmNnE2MWx1Zw=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram-link"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="social-icon" />
              <div className="social-info">
                <span className="social-platform">Instagram</span>
                <span className="social-handle">@thevsoft</span>
              </div>
            </a>
            
            <a
              href="https://www.linkedin.com/company/thevsoft-solutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link linkedin-link"
              aria-label="Connect with us on LinkedIn"
            >
              <LinkedIn className="social-icon" />
              <div className="social-info">
                <span className="social-platform">LinkedIn</span>
                <span className="social-handle">Vsoft Solutions</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>&copy; 2025 Vsoft Solutions. All rights reserved.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;