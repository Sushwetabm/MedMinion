import React, { useEffect, useState } from "react";
import AppointmentSection from "../../components/AppointmentSection";
import DoctorSection from "../../components/DoctorSection";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import "./MainPage.css"; 
import {useNavigate } from "react-router-dom";


function MainPage() {

  const [isUser, setIsUser] = useState();
  const navigate = useNavigate();

  const getCheck = async () => {
    try {
      const response = await fetch("http://localhost:5000/checkuser/checkuser", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      credentials: "include",
    }) 
     const checkhehe = await response.json();
     console.log(checkhehe)
      setIsUser(checkhehe["isUser"]);
    } catch (error) {
      console.log(error)
      navigate('/')
    }
  };
  useEffect(() => {
    getCheck();
    
  });

    return (
        <div className="App">
          <Navbar />
          <Header />
          {isUser ?   <AppointmentSection />:<DoctorSection />}
          <Footer />
        </div>
      );
}

export default MainPage
