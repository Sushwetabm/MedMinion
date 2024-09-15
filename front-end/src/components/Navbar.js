import React from "react";
import "./Navbar.css";
import { toast } from "react-toastify";
import logo from "../img/logo.png"; 
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        credentials: "include",
      });
      const data = await res.json();
      toast.success(data["msg"], {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log("success", res);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* Logo in top-left corner */}
      <div className="logo-container">
        <img src={logo} alt="MedMinion Logo" className="logo-circle" />
      </div>

      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#services">Service</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-btns">
            <button onClick={handleLogout}
              className="btn-appointment">
              Sign Out
            </button>
        </div>
        
      </nav>
    </>
  );
}

export default Navbar;
