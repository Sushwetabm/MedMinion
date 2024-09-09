import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Contact Us Section */}
        <div className="footer-section contact-us">
          <h3>Contact Us</h3>
          <p>123 Street, New York, USA</p>
          <p>info@example.com</p>
          <p>+012 345 67890</p>
        </div>

        {/* Follow Us Section */}
        <div className="footer-section follow-us">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Your Site Name. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
