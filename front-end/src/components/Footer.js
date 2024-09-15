import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-content">
        {/* Contact Us Section */}
        <div className="footer-section contact-us">
          <h3>Contact Us</h3>
          <h3>Team: Pookiesss </h3>
          <p>Rishav Sachdeva (sachdevarishav449@gmail.com)</p>
          <p>Sushweta Bhattacharya (sushwetabm@gmail.com)</p>
          <p>Hansawani Saini (hansawani07@gmail.com) </p>
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
        <p>© MedMinion. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
