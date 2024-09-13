import React from "react";
import "./Navbar.css";
import { toast } from "react-toastify";
import logo from "../img/logo.png"; // Ensure the logo path is correct
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
      console.log("sucess", res);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
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
          <li>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
            >
              Sign Out
            </button>
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
