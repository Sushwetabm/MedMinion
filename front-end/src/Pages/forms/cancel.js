import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './cancel.css';
const CancelAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [message, setMessage] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [error, setError] = useState('');


    // Function to fetch appointments when the button is clicked
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5001/fetch_appointments', {
                params: { patient_email: patientEmail }
            });

            if (response.data && response.data.length > 0) {
                setAppointments(response.data);
                setError('');
            } else {
                setAppointments([]);
                setError('No scheduled appointments found.');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError(error.response && error.response.data && error.response.data.error 
                ? error.response.data.error 
                : 'Error fetching appointments.');
        }
    };

    // Function to handle appointment cancellation
    const handleCancelAppointment = async () => {
        if (!selectedAppointment) {
            setMessage('Please select an appointment to cancel.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/cancel_appointment_flow', {
                patient_email: patientEmail,  
                appointment_date: selectedAppointment.appointment_date,  
                appointment_time:selectedAppointment.appointment_time,
            });

            setMessage(response.data.message);

            setAppointments(appointments.filter(app => app._id !== selectedAppointment.value));
            setSelectedAppointment(null); 
        } catch (error) {
            console.error('Error canceling appointment:', error);
            setMessage('Error canceling the appointment.');
        }
    };

    const handleAppointmentSelect = (option) => {
        setSelectedAppointment(option.value);
    };

    return (
        <div className="cancel-container">
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
                            value: app, 
                            label: `${app.doctor_name} - ${app.appointment_date} ${app.appointment_time}`
                        }))}
                        onChange={handleAppointmentSelect}
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
