import React from "react";
import "./Navbar.css";
import logo from "../img/logo.png"; // Ensure the logo path is correct

function Navbar() {
  return (
    <>
      {/* Logo in top-left corner */}
      <div className="logo-container">
        <img src={logo} alt="DentCare" className="logo-circle" />
      </div>

      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a> {/* Links to About Us section */}
          </li>
          <li>
            <a href="#services">Service</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-btns">
          <button className="btn-appointment">Appointment</button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
