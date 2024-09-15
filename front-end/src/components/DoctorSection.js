import React, { useState,useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DoctorSection.css";

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
  const [patientName, setPatientName] = useState("");
  const [patientID, setPatientID] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [doctorName, setDoctorName] = useState(""); // Doctor's name input
  const [isDoctorConfirmed, setIsDoctorConfirmed] = useState(false); // Flag to confirm doctor

  // Function to add symptoms and call backend API to detect disease
  const addSymptom = async () => {
    if (currentSymptom) {
      const updatedSymptoms = [...symptoms, currentSymptom];
      // setSymptoms(updatedSymptoms);
      setCurrentSymptom("");

      // Use the correct API route for disease detection
      const response = await fetch("http://localhost:5002/get_disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: updatedSymptoms.join(", ") }), // Send symptoms as input
      });

      const data = await response.json();
      // console.log(data);
      console.log("API Response: ", data);  // Check the API response here
      setDetectedDisease(data.diseases); // Detect disease
      setSymptoms(data.symptoms)
    }
  };

  const handleDiseaseInput = async (e) => {
    if (currentDisease) {
      const updatedDisease = [...diseasebyuser, currentDisease];
      setCurrentDisease("");

      // Use the same route to fetch medicines for disease input
      const response = await fetch("http://localhost:5002/get_medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: updatedDisease.join(", ")}), // Send disease as input
      });

      const data = await response.json();
      setDetectedMedicines(data.medicines);
      setDiseaseByUser(data.disease);
    
  }
  };

  // Function to handle doctor name confirmation
  const handleDoctorConfirmation = () => {
    if (doctorName) {
      setIsDoctorConfirmed(true);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    if (!doctorName) {
      alert("Please confirm your name first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/get_appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorName: doctorName,
          date: date.toISOString(), // Send the date in ISO format
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

      {/* Second Section: Calendar for Appointments */}
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
                      {appointment.time} - {appointment.patient}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
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
