import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const RescheduleAppointment = () => {
    const [patientEmail, setPatientEmail] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [doctorAvailability, setDoctorAvailability] = useState([]);
    const [newAppointmentSlot, setNewAppointmentSlot] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch appointments after patient email is entered
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
            setError(error.response?.data?.error || 'Error fetching appointments.');
        }
    };

    // Fetch doctor's availability based on the selected appointment
    const fetchDoctorAvailability = async (doctorName) => {
        try {
            const response = await axios.get('http://localhost:5001/fetch_doctor_availability', {
                params: { doctor_name: doctorName }
            });
            setDoctorAvailability(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching doctor availability:', error);
            setError('Error fetching doctor availability.');
        }
    };

    // Handle appointment selection and fetch availability
    const handleAppointmentSelect = (option) => {
        setSelectedAppointment(option.value);
        fetchDoctorAvailability(option.value.doctor_name);
    };

    // Handle rescheduling the selected appointment
    const handleReschedule = async () => {
        if (!selectedAppointment || !newAppointmentSlot) {
            setError('Please select an appointment and a new time slot to reschedule.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/reschedule_appointment_flow', {
                patient_email: patientEmail,
                old_appointment_date:selectedAppointment.appointment_date,
                old_appointment_time:selectedAppointment.appointment_time,
                new_appointment_date: newAppointmentSlot.date,
                new_appointment_time: newAppointmentSlot.time,
                doctor_name: selectedAppointment.doctor_name
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
                        onChange={handleAppointmentSelect}
                        value={selectedAppointment}
                    />
                </div>
            )}

            {doctorAvailability.length > 0 && (
                <div className="form-group">
                    <label>Select New Appointment Slot:</label>
                    <Select
                        options={doctorAvailability.map(slot => ({
                            value: { date: slot.date, time: slot.time },
                            label: `${slot.date} at ${slot.time}`
                        }))}
                        onChange={(option) => setNewAppointmentSlot(option.value)}
                    />
                </div>
            )}

            <button onClick={handleReschedule}>Reschedule Appointment</button>

            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default RescheduleAppointment;
