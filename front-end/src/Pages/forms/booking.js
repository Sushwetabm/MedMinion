import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './BookingStyles.css';
// Component for booking an appointment
const BookAppointment = () => {
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [patientEmail, setPatientEmail] = useState('');
    const [contact, setContact] = useState('');

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5001/fetch_departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    // Fetch locations based on selected department
    useEffect(() => {
        const fetchLocations = async () => {
            if (selectedDepartment) {
                try {
                    const response = await axios.get(`http://localhost:5001/fetch_locations?department=${selectedDepartment.value}`);
                    setLocations(response.data);
                } catch (error) {
                    console.error('Error fetching locations:', error);
                }
            }
        };
        fetchLocations();
    }, [selectedDepartment]);

    // Fetch doctors based on selected department
    useEffect(() => {
        const fetchDoctors = async () => {
            if (selectedDepartment) {
                try {
                    const response = await axios.get(`http://localhost:5001/fetch_doctors?department=${selectedDepartment.value}`);
                    setDoctors(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                }
            }
        };
        fetchDoctors();
    }, [selectedDepartment]);

    // Fetch availability for the selected doctor
    useEffect(() => {
        const fetchAvailability = async () => {
            if (selectedDoctor) {
                try {
                    const response = await axios.get(`http://localhost:5001/fetch_doctor_availability?doctor_name=${selectedDoctor.value}`);
                    setAvailability(response.data);
                } catch (error) {
                    console.error('Error fetching availability:', error);
                }
            }
        };
        fetchAvailability();
    }, [selectedDoctor]);

    // Handle appointment booking
    const handleBookAppointment = async () => {
        try {
            const response = await axios.post('http://localhost:5001/book_appointment', {
                patient_email: patientEmail,
                doctor_name: selectedDoctor?.value,
                appointment_date: selectedDate?.value,
                appointment_time: selectedTime?.value,
                clinic_location: selectedLocation?.value,
                doctor_contact: contact,
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    const handleDoctorChange = (selectedOption) => {
        setSelectedDoctor(selectedOption);
        setContact(selectedOption.contact);  // Set the contact when a doctor is selected
    };

    return (
        <div className="booking-container">
            <h1>Book an Appointment</h1>
            <div className="select-container">
                <label>Select Department:</label>
                <Select
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    onChange={setSelectedDepartment}
                    value={selectedDepartment}
                />
            </div>
            {selectedDepartment && (
                <div className="select-container">
                    <label>Select Location:</label>
                    <Select
                        options={locations.map(loc => ({ value: loc, label: loc }))}
                        onChange={setSelectedLocation}
                        value={selectedLocation}
                    />
                </div>
            )}
            {selectedDepartment && (
                <div className="select-container">
                    <label>Select Doctor:</label>
                    <Select
                        options={doctors.map(doc => ({
                            value: doc[' Doctors Name'],  // Corrected extra space
                            label: doc[' Doctors Name'],  // Corrected extra space
                            contact: doc['Contact'],  // Pass contact as part of the option
                        }))}
                        onChange={handleDoctorChange}  // Handle doctor change
                        value={selectedDoctor}
                    />
                </div>
            )}
            {selectedDoctor && availability.length > 0 && (
                <div className="select-container">
                    <label>Select Date:</label>
                    <Select
                        options={availability.map(avail => ({ value: avail.date, label: avail.date }))}
                        onChange={setSelectedDate}
                        value={selectedDate}
                    />
                    {selectedDate && (
                        <div className="select-container">
                            <label>Select Time Slot:</label>
                            <Select
                                options={availability.find(avail => avail.date === selectedDate.value)?.available_times?.map(time => ({ value: time, label: time })) || []}
                                onChange={setSelectedTime}
                                value={selectedTime}
                            />
                        </div>
                    )}
                </div>
            )}
            <div>
                <label>Patient Email:</label>
                <input type="email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} />
            </div>
            <div>
                <label>Doctor Contact:</label>
                <input type="text" value={contact} readOnly />
            </div>
            <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>
    );
};

export default BookAppointment;
