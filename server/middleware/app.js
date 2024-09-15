const express = require("express");
const { checkAuthentication } = require("./middlewares/user-auth");
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

//Authetication middleware
app.use(checkAuthentication);

// Your routes
app.post("/check_doctor", async (req, res) => {
  console.log("Received request body:", req.body); // Log the entire request body
  const { doctorName } = req.body;

  if (!doctorName) {
    console.log("Doctor name is missing from the request");
    return res.status(400).json({ message: "Doctor name is required" });
  }

  try {
    const doctor = await db
      .collection("Doctors Availability Collection")
      .findOne({ doctor_name: { $regex: new RegExp(`^${doctorName}$`, "i") } });

    if (doctor) {
      console.log("Received doctor name:", doctorName);
      return res.status(200).json({ exists: true });
    } else {
      return res
        .status(404)
        .json({ exists: false, message: "Doctor not found." });
    }
  } catch (error) {
    console.error("Error checking doctor:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Another route
app.post("/get_appointments", async (req, res) => {
  const { doctorName, dayOfWeek } = req.body;

  if (!doctorName || !dayOfWeek) {
    return res
      .status(400)
      .json({ message: "Doctor name and day of the week are required" });
  }

  try {
    const doctor = await db
      .collection("Doctors Availability Collection")
      .findOne({ doctor_name: doctorName });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availability = doctor.availability[dayOfWeek];
    if (!availability) {
      return res
        .status(404)
        .json({ message: `No availability found for ${dayOfWeek}` });
    }

    const appointments = [];
    for (const [timeSlot, slots] of Object.entries(availability)) {
      const bookedSlots = slots.reduce((acc, curr) => acc + curr, 0);
      appointments.push({ time: timeSlot, bookedSlots });
    }

    return res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res
      .status(500)
      .json({ message: "Error fetching appointments", error });
  }
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
