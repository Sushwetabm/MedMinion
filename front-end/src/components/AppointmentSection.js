import React, { useEffect, useRef, useState } from "react";
import "./AppointmentSection.css";
import axios from "axios";

function AppointmentSection() {
  const [visibleBox, setVisibleBox] = useState(-1);
  const [patientInfo, setPatientInfo] = useState(null); // State to hold patient information
  const boxesRef = useRef([]);
  const [appointments, setAppointments] = useState(null); // State to hold fetched appointments
  const [appointmentsFetched, setAppointmentsFetched] = useState(false); // Track if appointments have been fetched

  // useEffect(() => {
  //   const fetchPatientInfo = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/patient/details', {
  //         headers: {
  //           Authorization: `Bearer ${document.cookie.split('token=')[1]}` // Assuming you store the token in cookies
  //         }
  //       });
  //       console.log(response.data)
  //       setPatientInfo(response.data);
  //     } catch (error) {
  //       console.error('Error fetching patient information:', error);
  //     }
  //   };

  //   fetchPatientInfo();
  // }, []);
  const fetchAppointments = async () => {
    if (patientInfo && patientInfo.length > 0) {
      const email = encodeURIComponent(patientInfo[0].email);
      try {
        const response = await axios.get(
          `http://localhost:5000/patient_booking/fetch_appointments/${email}`
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setAppointmentsFetched(true); // Mark that the appointments have been fetched
      }
    }
  };
  const getEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/patient/details", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //   "Access-Control-Allow-Credentials": true,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const patientInfo = await response.json();
      setPatientInfo(patientInfo["msg"]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = boxesRef.current.indexOf(entry.target);
            if (index !== -1) {
              setVisibleBox(index);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    boxesRef.current.forEach((box) => observer.observe(box));

    return () => {
      // Unobserve elements
      boxesRef.current.forEach((box) => {
        if (box instanceof Element) {
          observer.unobserve(box);
        }
      });
    };
  }, []);


  return (
    <div className="appointment-section">
      {/*Section 1*/}
      <div
        className={`box box1 ${visibleBox >= 0 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[0] = el)}
      >
        <h3>PROFILE INFORMATION</h3>
        {patientInfo &&
          patientInfo.map((patient, index) => (
            <div className="patient-info" key={index}>
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{patient.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{patient.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{patient.phone}</span>
              </div>
              <div className="info-item">
                <span className="label">Age:</span>
                <span className="value">{patient.age}</span>
              </div>
            </div>
          ))}
        <button className="appointment-btn" onClick={fetchAppointments}>
          Your Appointments
        </button>

        {appointmentsFetched &&
          (appointments && appointments.length > 0 ? (
            <div className="appointments-list">
              <h4>Your Appointments</h4>
              {appointments.map((appointment, index) => (
                <div className="appointment-info" key={index}>
                  <div className="info-item">
                    <span className="label">Doctor:</span>
                    <span className="value">{appointment.doctor_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Date:</span>
                    <span className="value">
                      {appointment.appointment_date}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Time:</span>
                    <span className="value">
                      {appointment.appointment_time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments scheduled</p>
          ))}
      </div>
      <div
        className={`box box2 ${visibleBox >= 1 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[1] = el)}
      >
        <h3>APPOINTMENT</h3>
        <a href="/bookingpage">
          <button className="search-btn">Book</button>
        </a>
        <br></br>
        <a href="/reschedulepage">
          <button className="search-btn">Reschedule</button>
        </a>
        <br></br>
        <a href="/cancelpage">
          <button className="search-btn">Cancel</button>
        </a>
        <br></br>
      </div>
      <div
        className={`box box3 ${visibleBox >= 2 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[2] = el)}
      >
        <h3>YOUR TEST RESULTS</h3>
        <button className="appointment-btn">Download test results</button>
        {patientInfo &&
          patientInfo.map((patient, index) => (
            <div className="patient-info" key={index}>
              <a
                href={`http://localhost:5000${patient.pdf}`}
                className="reports"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click on this link to download Your Test Reports
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AppointmentSection;
