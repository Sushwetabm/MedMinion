// routes/patient_booking.js
const express = require("express");
const router = express.Router();
const { fetchAppointmentsByEmail } = require("../controllers/patient_booking");

// Route to get appointments
router.get("/fetch_appointments/:email", fetchAppointmentsByEmail);

module.exports = router;
