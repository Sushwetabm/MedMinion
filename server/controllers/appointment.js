const { getDB } = require('../db');

async function checkDoctor(req, res) {
  const { doctorName } = req.body;
  if (!doctorName) {
    return res.status(400).json({ message: 'Doctor name is required' });
  }

  try {
    const db = getDB();
    const doctor = await db
      .collection('Doctors Availability Collection')
      .findOne({ doctor_name: { $regex: new RegExp(`^${doctorName}$`, 'i') } });

    if (doctor) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(404).json({ exists: false, message: 'Doctor not found.' });
    }
  } catch (error) {
    console.error('Error checking doctor:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getAppointments(req, res) {
  const { doctorName, dayOfWeek } = req.body;

  if (!doctorName || !dayOfWeek) {
    return res.status(400).json({ message: 'Doctor name and day of the week are required' });
  }

  try {
    const db = getDB();
    const doctor = await db
      .collection('Doctors Availability Collection')
      .findOne({ doctor_name: doctorName });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const availability = doctor.availability[dayOfWeek];
    if (!availability) {
      return res.status(404).json({ message: `No availability found for ${dayOfWeek}` });
    }

    const appointments = [];
    for (const [timeSlot, slots] of Object.entries(availability)) {
      const bookedSlots = slots.reduce((acc, curr) => acc + curr, 0);
      appointments.push({ time: timeSlot, bookedSlots });
    }

    return res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Error fetching appointments', error });
  }
}

module.exports = {
  checkDoctor,
  getAppointments
};
