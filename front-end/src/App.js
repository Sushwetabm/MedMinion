// src/App.js
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import AppointmentSection from "./components/AppointmentSection";
import DoctorSection from "./components/DoctorSection";
import Footer from "./components/Footer";
import "./App.css"; // Main CSS

function App() {
  // Simulating user role for now (this would come from user authentication)
  const [isDoctor, setIsDoctor] = useState(true); // Change to true to see doctor's page

  return (
    <div className="App">
      <Navbar />
      <Header />
      <AboutUs />
      {/* Conditional Rendering based on role */}
      {isDoctor ? <DoctorSection /> : <AppointmentSection />}
      <Footer />
    </div>
  );
}

export default App;
