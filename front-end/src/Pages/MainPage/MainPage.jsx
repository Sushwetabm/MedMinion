import React from 'react';
import AppointmentSection from "../../components/AppointmentSection";
import DoctorSection from "../../components/DoctorSection";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import AboutUs from "../../components/AboutUs";
import "./MainPage.css"; 
import { useState } from "react";

function MainPage() {

    const [isDoctor, setIsDoctor] = useState(true); 

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

export default MainPage
