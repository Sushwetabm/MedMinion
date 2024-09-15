import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DoctorSection.css";
import axios, { AxiosHeaders } from 'axios';

function DoctorSection() {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [currentDisease, setCurrentDisease] = useState("");
  const [disease, setDisease] = useState([]);
  const [diseasebyuser, setDiseaseByUser] = useState([]);
  const [detectedDisease, setDetectedDisease] = useState([]);
  const [detectedMedicines, setDetectedMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [patientName, setPatientName] = useState("");
  // const [patientEmail, setPatientEmail] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [isDoctorConfirmed, setIsDoctorConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message for invalid doctor
  const [message, setMessage] = useState('');


  const [fileData, setFileData] = useState({
    reports: null,
    patientName:null,
    patientEmail:null
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    
      let reports = fileData.reports;
      let patientName=fileData.patientName;
      let patientEmail=fileData.patientEmail;

      const response = await axios.post(
          "http://localhost:5000/patient/patient_reports",
          {
              reports,patientEmail,patientName
          },
          {
              headers: {
                  "Content-Type": "multipart/form-data",
                  "Access-Control-Allow-Credentials": true,
              },
              withCredentials: true,
          }
      )
      setMessage(response.data.message);
      setFileData({
          reports: null,
          patientEmail:"",
          patientName:"",
      });
  } catch (error) {
      if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
      ) {
          setMessage(error.response.data.message);
      }
  }
};

  const handleChange = ({ currentTarget: input }) => {
    if (input.type === "file") {
      setFileData({ ...fileData, [input.name]: input.files[0] });
  } else {
      setFileData({ ...fileData, [input.name]: input.value });
  }
};



  const addSymptom = async () => {
    if (currentSymptom) {
      const updatedSymptoms = [...symptoms, currentSymptom];
      // setSymptoms(updatedSymptoms);
      setCurrentSymptom("");

      const response = await fetch("http://localhost:5002/get_disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: updatedSymptoms.join(", ") }),
      });

      const data = await response.json();
      // console.log(data);
      console.log("API Response: ", data);
      setDetectedDisease(data.diseases);
      setSymptoms(data.symptoms)
    }
  };

  const handleDiseaseInput = async (e) => {
    if (currentDisease) {
      const updatedDisease = [...diseasebyuser, currentDisease];
      setCurrentDisease("");

      const response = await fetch("http://localhost:5002/get_medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: updatedDisease.join(", ") }),
      });

      const data = await response.json();
      setDetectedMedicines(data.medicines);
      setDiseaseByUser(data.disease);

    }
  };

  // Function to handle doctor name confirmation
  const handleDoctorConfirmation = async () => {
    if (doctorName) {

      try {
        const response = await fetch("http://localhost:5000/doctor/check_doctor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorName: doctorName }), // Ensure doctorName is sent properly
        });

        const data = await response.json();

        if (response.ok && data.exists) {
          setIsDoctorConfirmed(true);
          setErrorMessage(""); // Clear error message if doctor is found
        } else {
          setErrorMessage("Doctor not found. Please input a valid name.");
        }
      } catch (error) {
        console.error("Error checking doctor name", error);
        setErrorMessage("An error occurred while checking the doctor.");
      }
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    if (!doctorName) {
      alert("Please confirm your name first.");
      return;
    }

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

    try {
      const response = await fetch("http://localhost:5000/doctor/get_appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: doctorName,
          dayOfWeek: dayOfWeek, // Send the day of the week instead of the full date
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.appointments || data.appointments.length === 0) {
          setAppointments([]);
          console.log("No appointments available");
        } else {
          setAppointments(
            data.appointments.map((appointment) => ({
              time: appointment.time,
              bookedSlots: appointment.bookedSlots,
            }))
          );
        }
      } else {
        console.error("Error fetching appointments", data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  return (
    <div className="doctor-section">
      {/* First Section: Symptom and Disease Input */}
      <div className="section">
        <div className="doctor-box">
          <h3>Input Symptom</h3>
          <input
            type="text"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            placeholder="Enter symptom"
          />
          <button onClick={addSymptom}>Add Symptom</button>
          <div className="output-box">
            <h4>Symptoms List</h4>
            <ul>
              {symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
            {detectedDisease && detectedDisease.length > 0 && (
              <div>
                <h4>Detected Diseases</h4>
                <ul>
                  {detectedDisease.map((disease, index) => (
                    <li key={index}>{disease}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        <div className="doctor-box">
          <h3>Input Disease</h3>
          <input
            type="text"
            value={currentDisease}
            onChange={(e) => setCurrentDisease(e.target.value)}
            placeholder="Enter disease"
          />
          <button onClick={handleDiseaseInput}>Add Symptom</button>
          <div className="output-box">
            <h4>Disease Input</h4>
            <ul>
              {diseasebyuser.map((dis, index) => (
                <li key={index}>{dis}</li>
              ))}
            </ul>
            {Array.isArray(detectedMedicines) &&
              detectedMedicines.length > 0 && (
                <div>
                  <h4>Detected Medicines</h4>
                  <ul>
                    {detectedMedicines.map((medicine, index) => (
                      <li key={index}>{medicine}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>

      {/*  ########## Second Section: Calendar for Appointments ##############*/}
      <div className="section">
        <div className="doctor-box">
          {!isDoctorConfirmed ? (
            <>
              <h3>Confirm Doctor's Name</h3>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Enter your name"
              />
              <button onClick={handleDoctorConfirmation}>Confirm</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          ) : (
            <>
              <h3>Select a Day for Appointments</h3>
              <Calendar onChange={handleDateChange} value={selectedDate} />
              <div className="output-box">
                <h4>Appointments on {selectedDate.toDateString()}</h4>
                <ul>
                  {appointments.map((appointment, index) => (
                    <li key={index}>
                      {appointment.time} - {appointment.bookedSlots} slots
                      booked
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ############ Third Section: Patient Info and File Upload ################# */}
      <div className="section">
      <form onSubmit={handleSubmit}>
        <div className="doctor-box">
          <h3>Patient Information</h3>
          <input
            type="text"
            name="patientName"
            value={fileData.patientName}
            onChange={handleChange}
            placeholder="Enter Patient Name"
          />
          <input
            type="email"
            value={fileData.patientEmail}
            name="patientEmail"
            onChange={handleChange}
            placeholder="Enter Patient Email"
          />
          <div>
            <h4>Upload Patient Reports</h4>
            <input
              type="file"
              accept="application/pdf"
              name="reports"
              onChange={handleChange}
            />
            <button type="submit">Submit</button>

            {pdfFile && <p>Uploaded File: {pdfFile.name}</p>}
          </div>
        </div>
        </form>
        {message && <p>{message}</p>}

      </div>
    </div>
  );
}

export default DoctorSection;
