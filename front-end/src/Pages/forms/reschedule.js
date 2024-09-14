import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const RescheduleAppointment = () => {
    const [patientEmail, setPatientEmail] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newAppointmentDate, setNewAppointmentDate] = useState('');
    const [newAppointmentTime, setNewAppointmentTime] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch appointments after patient ID is entered
    const fetchAppointments = async () => {
        try {
            const response = await axios.post('http://localhost:5000/fetch_appointments', { patient_email: patientEmail });
            
            if (response.data.appointments && response.data.appointments.length > 0) {
                setAppointments(response.data.appointments);
                setError('');
            } else if (response.data.error) {
                setError(response.data.error);
            } else {
                setAppointments([]);
                setError('No scheduled appointments found.');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error.response);  // Check the actual response
            setError(error.response ? error.response.data.error : 'Error fetching appointments.');
        }
    };
    
    

    // Handle rescheduling the selected appointment
    const handleReschedule = async () => {
        if (!selectedAppointment) {
            setError('Please select an appointment to reschedule.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/reschedule_appointment_flow', {
                patient_email: patientEmail,
                new_appointment_date: newAppointmentDate,
                new_appointment_time: newAppointmentTime
            });

            if (response.data.message) {
                setResponseMessage(response.data.message);
                setError('');
            } else if (response.data.error) {
                setError(response.data.error);
                setResponseMessage('');
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            setError('An error occurred while rescheduling the appointment.');
            setResponseMessage('');
        }
    };

    return (
        <div className="reschedule-container">
            <h1>Reschedule Appointment</h1>

            <div className="form-group">
                <label>Patient Email:</label>
                <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="Enter Patient Email"
                    required
                />
                <button onClick={fetchAppointments}>Fetch Appointments</button>
            </div>

            {appointments.length > 0 && (
                <div className="form-group">
                    <label>Select Appointment to Reschedule:</label>
                    <Select
                        options={appointments.map(appointment => ({
                            value: appointment,
                            label: `Doctor: ${appointment.doctor_name}, Date: ${appointment.appointment_date}, Time: ${appointment.appointment_time}`
                        }))}
                        onChange={(option) => setSelectedAppointment(option.value)}
                        value={selectedAppointment}
                    />
                </div>
            )}

            {selectedAppointment && (
                <>
                    <div className="form-group">
                        <label>New Appointment Date:</label>
                        <input
                            type="date"
                            value={newAppointmentDate}
                            onChange={(e) => setNewAppointmentDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Appointment Time:</label>
                        <input
                            type="time"
                            value={newAppointmentTime}
                            onChange={(e) => setNewAppointmentTime(e.target.value)}
                            required
                        />
                    </div>

                    <button onClick={handleReschedule}>Reschedule Appointment</button>
                </>
            )}

            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default RescheduleAppointment;
