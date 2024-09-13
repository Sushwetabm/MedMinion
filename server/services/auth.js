const jwt= require('jsonwebtoken')
const sect = "MedMinion";
function setPatient(patient,role) {
  return jwt.sign(
    {
      _id: patient._id,
      email: patient.email,
      role:role
    },
    sect
  );
}

function getPatient(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, sect);
  } catch (err) {
    return null;
  }
}

module.exports = {
  setPatient,
  getPatient,
};