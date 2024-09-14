import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CancelAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [message, setMessage] = useState('');
    const [patientEmail, setPatientEmail] = useState('');

    // Fetch scheduled appointments on component mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.post('http://localhost:5000/get_scheduled_appointments', {
                    patient_email: patientEmail,
                });
                setAppointments(response.data.appointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (patientEmail) {
            fetchAppointments();
        }
    }, [patientEmail]);

    // Handle appointment cancelation
    const handleCancelAppointment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/cancel_appointment_flow', {
                appointment_id: selectedAppointment?.value,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error canceling appointment:', error);
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
            </div>
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
            <button onClick={handleCancelAppointment}>Cancel Appointment</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CancelAppointment;
