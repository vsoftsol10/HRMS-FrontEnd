import React from 'react';
import "./Footer.css"
import logo from "../../assets/logo1.png"
import { Instagram, LinkedIn, YouTube, Phone, Language, Email } from '@mui/icons-material';

const Footer = () => {
  return (
    <>
      <footer className="dashboard-footer">
        <div className="footer-content">
          {/* Column 1 - Address */}
          <div className="footer-section">
            <div className="logo-container">
              {/* Replace with your actual logo */}

              {/* Uncomment and use this if you have a logo image */}
              <img src={logo} alt="logo" className="logo-image" />
            </div>
            <div className="address-section">
              <p>10J2, 2nd block, Tiruvandrum Road</p>
              <p>Vannarapettai, Tirunelveli.</p>
              <p>Tamilnadu - 627002, India.</p>
            </div>
          </div>



          {/* Column 2 - Contact Us */}
          <div className="footer-section contact-links">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <span className="icon">📞</span>
              <span><strong>+91 90954 22237</strong></span>
            </div>
            <div className="contact-item">
              <span className="icon">🌐</span>
              <a href="https://www.thevsoft.com" target="_blank" rel="noopener noreferrer">
                www.thevsoft.com
              </a>
            </div>
            <div className="contact-item">
              <span className="icon">📧</span>
              <a href="mailto:info@thevsoft.com">
                info@thevsoft.com
              </a>
            </div>
          </div>

          {/* Column 3 - Social Media */}
          <div className="footer-section social-links">
            <h4>Social Medias</h4>
            <a
              href="https://www.instagram.com/thevsoft?igsh=MXdiMTlmNnE2MWx1Zw=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-item"
            >
              <Instagram fontSize="small" />
              <span><strong>Instagram</strong></span>
            </a>

            <a
              href="https://www.linkedin.com/company/thevsoft-solutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-item"
            >
              <LinkedIn fontSize="small" />
              <span><strong>LinkedIn</strong></span>
            </a>
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className="footer-bottom">
          <p>© 2025 Vsoft Solutions. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;