// routes/doctor.js
const express = require('express');
const router = express.Router();
const { checkDoctor, getAppointments } = require('../controllers/appointment');

// Route to check if a doctor exists
router.post('/check_doctor', checkDoctor);

// Route to get appointments
router.post('/get_appointments', getAppointments);

module.exports = router;
