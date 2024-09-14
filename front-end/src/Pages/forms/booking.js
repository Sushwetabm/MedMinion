import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// Component for booking an appointment
const BookAppointment = () => {
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [patientId, setPatientId] = useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        // Fetch departments when component mounts
        fetch('/fetch_departments')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            // Fetch locations based on selected department
            fetch(`/fetch_locations?department=${selectedDepartment.value}`)
                .then(response => response.json())
                .then(data => setLocations(data))
                .catch(error => console.error('Error fetching locations:', error));
        }
    }, [selectedDepartment]);

    useEffect(() => {
        if (selectedDepartment && selectedLocation) {
            // Fetch doctors based on selected department and location
            fetch(`/fetch_doctors?location=${selectedLocation.value}`)
                .then(response => response.json())
                .then(data => setDoctors(data))
                .catch(error => console.error('Error fetching doctors:', error));
        }
    }, [selectedDepartment, selectedLocation]);

    useEffect(() => {
        if (selectedDoctor) {
            // Fetch availability for the selected doctor
            fetch(`/fetch_doctor_availability?doctor=${selectedDoctor.value}`)
                .then(response => response.json())
                .then(data => setAvailability(data))
                .catch(error => console.error('Error fetching availability:', error));
        }
    }, [selectedDoctor]);

    const handleBookAppointment = () => {
        // Book appointment
        fetch('/book_appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId,
                doctorName: selectedDoctor.value,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                clinicLocation: selectedLocation.value,
                doctorContact: contact,
            }),
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error booking appointment:', error));
    };

    return (
        <div>
            <h1>Book an Appointment</h1>
            <div>
                <label>Select Department:</label>
                <Select
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    onChange={setSelectedDepartment}
                />
            </div>
            {selectedDepartment && (
                <div>
                    <label>Select Location:</label>
                    <Select
                        options={locations.map(loc => ({ value: loc, label: loc }))}
                        onChange={setSelectedLocation}
                    />
                </div>
            )}
            {selectedLocation && (
                <div>
                    <label>Select Doctor:</label>
                    <Select
                        options={doctors.map(doc => ({ value: doc, label: doc }))}
                        onChange={setSelectedDoctor}
                    />
                </div>
            )}
            {selectedDoctor && availability.length > 0 && (
                <div>
                    <label>Select Date:</label>
                    <Select
                        options={availability.map(avail => ({ value: avail.date, label: avail.date }))}
                        onChange={setSelectedDate}
                    />
                    {selectedDate && (
                        <div>
                            <label>Select Time Slot:</label>
                            <Select
                                options={availability.find(avail => avail.date === selectedDate).availableTimes.map(time => ({ value: time, label: time }))}
                                onChange={setSelectedTime}
                            />
                        </div>
                    )}
                </div>
            )}
            <div>
                <label>Patient ID:</label>
                <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} />
            </div>
            <div>
                <label>Contact Information:</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} />
            </div>
            <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>
    );
};

export default BookAppointment;
