import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CancelAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [message, setMessage] = useState('');
    const [patientEmail, setPatientEmail] = useState('');

    // Function to fetch appointments when the button is clicked
    const fetchAppointments = async () => {
        if (!patientEmail) {
            setMessage('Please enter your email.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/fetch_appointments', {
                patient_email: patientEmail,
            });

            // Check if appointments exist
            if (response.data.appointments && response.data.appointments.length > 0) {
                setAppointments(response.data.appointments);
                setMessage('Appointments fetched successfully.');
            } else {
                setAppointments([]);
                setMessage('No scheduled appointments found.');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setMessage('Error fetching appointments.');
        }
    };

    // Function to handle appointment cancellation
    const handleCancelAppointment = async () => {
        if (!selectedAppointment) {
            setMessage('Please select an appointment to cancel.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/cancel_appointment_flow', {
                patient_email: patientEmail,  // Add patient email
                appointment_id: selectedAppointment.value,  // Pass appointment ID
            });

            setMessage(response.data.message);

            // Optionally remove the canceled appointment from the dropdown
            setAppointments(appointments.filter(app => app._id !== selectedAppointment.value));
            setSelectedAppointment(null); // Clear the selection
        } catch (error) {
            console.error('Error canceling appointment:', error);
            setMessage('Error canceling the appointment.');
        }
    };

    return (
        <div>
            <h1>Cancel Appointment</h1>
            <div>
                <label>Enter your email:</label>
                <input 
                    type="email" 
                    value={patientEmail} 
                    onChange={(e) => setPatientEmail(e.target.value)} 
                />
                <button onClick={fetchAppointments}>Fetch Appointments</button>
            </div>
            {appointments.length > 0 && (
                <div>
                    <label>Select Appointment to Cancel:</label>
                    <Select
                        options={appointments.map(app => ({
                            value: app._id, 
                            label: `${app.doctor_name} - ${app.appointment_date} ${app.appointment_time}`
                        }))}
                        onChange={setSelectedAppointment}
                        value={selectedAppointment}
                    />
                </div>
            )}
            <button onClick={handleCancelAppointment}>Cancel Appointment</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CancelAppointment;
