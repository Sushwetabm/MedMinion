import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DoctorSection.css";

function DoctorSection() {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [disease, setDisease] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientName, setPatientName] = useState("");
  const [patientID, setPatientID] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const addSymptom = () => {
    if (currentSymptom) {
      setSymptoms([...symptoms, currentSymptom]);
      setCurrentSymptom("");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAppointments([
      { time: "9:00 AM", patient: "John Doe" },
      { time: "11:00 AM", patient: "Jane Smith" },
    ]);
  };

  const handleFileUpload = (e) => {
    setPdfFile(e.target.files[0]);
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
          </div>
        </div>

        <div className="doctor-box">
          <h3>Input Disease</h3>
          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Enter disease"
          />
          <div className="output-box">
            <h4>Disease Input</h4>
            <p>{disease}</p>
          </div>
        </div>
      </div>

      {/* Second Section: Calendar for Appointments */}
      <div className="section">
        <div className="doctor-box">
          <h3>Select a Day for Appointments</h3>
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <div className="output-box">
            <h4>Appointments on {selectedDate.toDateString()}</h4>
            <ul>
              {appointments.map((appointment, index) => (
                <li key={index}>
                  {appointment.time} - {appointment.patient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Third Section: Patient Info and File Upload */}
      <div className="section">
        <div className="doctor-box">
          <h3>Patient Information</h3>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter Patient Name"
          />
          <input
            type="text"
            value={patientID}
            onChange={(e) => setPatientID(e.target.value)}
            placeholder="Enter Patient ID"
          />
          <div>
            <h4>Upload Patient PDF</h4>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
            />
            {pdfFile && <p>Uploaded File: {pdfFile.name}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSection;
