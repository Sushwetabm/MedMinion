const { getPatient } = require("../services/auth");
const { errorHandler } = require("../error");

async function checkAuthentication(req, res, next) {
  const pid = req.cookies.pid;
  if (!pid) {
    const aid = req.cookies?.aid;
    if (!aid) {
      return next(new errorHandler("First Login to the website", 400));
    }
    const admin = getPatient(aid);
    req.patient = admin;
  } else {
    const patient = getPatient(pid);
    req.patient = patient;
  }
  return next();
}

module.exports = {
  checkAuthentication,
};

// const { getPatient } = require("../services/auth"); // Ensure this method is updated to fetch patient details
// const { errorHandler } = require("../error");

// async function checkAuthentication(req, res, next) {
//     const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer [token]"

//     if (!token) {
//         return next(new errorHandler("First Login to the website", 400));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const patient = await getPatient(decoded._id); // Fetch patient based on decoded ID

//         if (!patient) {
//             return next(new errorHandler("Unauthorized access - Invalid token!", 401));
//         }

//         req.patient = patient;
//         next();
//     } catch (error) {
//         return next(new errorHandler("Unauthorized access - Invalid token!", 401));
//     }
// }

// module.exports = {
//     checkAuthentication,
// };
