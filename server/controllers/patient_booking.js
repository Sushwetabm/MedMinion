const { getDB } = require("../db");

async function fetchAppointmentsByEmail(req, res) {
  const { email } = req.params;
  console.log("Received email:", email); // Log the email for debugging
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const db = getDB();
    const appointments = await db
      .collection("Appointments_Collection")
      .find({ patient_email: email }) // Assuming you store the patient's email in `patient_email`
      .toArray();

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    return res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res
      .status(500)
      .json({ message: "Error fetching appointments", error });
  }
}

module.exports = {
  fetchAppointmentsByEmail,
};
