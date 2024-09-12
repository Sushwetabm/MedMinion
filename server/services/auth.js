const jwt= require('jsonwebtoken')
const sect = "MedMinion";
function setUser(user,role) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role:role
    },
    sect
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, sect);
  } catch (err) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};