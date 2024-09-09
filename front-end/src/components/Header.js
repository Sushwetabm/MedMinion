import React from "react";
import "./Header.css"; 

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Take The Best Quality Health Treatment</h1>
        <p>Keep yourself healthy with MedMinions</p>
        <div className="header-buttons">
          <button className="btn-primary">Appointment</button>
          <button className="btn-secondary">Contact Us</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
