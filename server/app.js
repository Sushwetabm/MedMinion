app.post("/get_appointments", async (req, res) => {
  const { doctorName, date } = req.body;

  // Log received data for debugging
  console.log("Received data:", { doctorName, date });

  // Validate request body
  if (!doctorName || !date) {
    return res
      .status(400)
      .json({ message: "Doctor name and date are required" });
  }

  try {
    // Find the doctor in the database
    const doctor = await db
      .collection("Doctors Availability Collection")
      .findOne({ doctor_name: doctorName });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Convert the date to a day of the week
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Get the availability for the selected day
    const availability = doctor.availability[dayOfWeek] || {};
    const appointments = [];

    // Process the availability to get the number of booked slots
    for (const [timeSlot, slots] of Object.entries(availability)) {
      const bookedSlots = slots.reduce((acc, curr) => acc + curr, 0);
      appointments.push({ time: timeSlot, bookedSlots });
    }

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
});
